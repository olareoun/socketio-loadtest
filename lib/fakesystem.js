var Promise = require('bluebird'),
    _ = require('underscore-node'),
    io = require('socket.io-client');


module.exports = function(opts, params={}, generator){
  //private members
  var sockets = new Array();

  var defaults = {
    transports: ['websocket'],
    forceNew: true
  };

  var defaultParams = {
    connections: 1
  }

  var options = _.extend(defaults, opts);
  var myParams = _.extend(defaultParams, params);

  function start() {
    var promises = new Array();
    for(var i = 0; i < myParams.connections; i++) {
      promises.push(startSingle());
    }
    return Promise.all(promises);
  };

  function startSingle() {
    return new Promise(function(resolve, reject) {
      var socket = io.connect(options.serverUrl, options);
      socket.on('connect', function() {
        resolve({ connected: true, socket: socket});
      });
      socket.on('connect_error', function(err) {
        reject({ connected: false, error: err });
      });
      sockets.push(socket);
    });
  };

  function stop(){
    var promises = new Array();
    for(var i = 0; i < params.connections; i++) {
      promises.push(stopSingle(sockets.pop()));
    }
    return Promise.all(promises);
  };

  function stopSingle(socket) {
    return new Promise(function(resolve, reject){
      try {
        //console.log('Disconnected');
        if(socket){
          socket.disconnect();
          socket = null;
        }
        resolve({ connected: false });
      }
      catch(err) {
        console.log(err);
        reject({ error: err });
      }
    });
  };

  function sendEvent(index, eventNumber) {
    return new Promise(function(resolve, reject){
      var newEvent = generator.createEvent();
      newEvent.theIndex = eventNumber;
      console.info(`${identity(index)}: going to emit event ${eventNumber}`)
      const start = Date.now()
      sockets[index].emit('EVENT:CREATE', newEvent, function(result){
        const latency = Date.now() - start
        const watched = Object.assign({}, result, { latency: latency })
        if(result.success){
          logSuccess(index, eventNumber, latency)
          resolve(watched);
        }
        else {
          logError(index, eventNumber, latency)
          reject(watched);
        }
      });
    });
  };

  function logSuccess(index, eventNumber, latency) {
    logDone(index, eventNumber, latency, 'SUCCESS')
  }

  function logError(index, eventNumber, latency) {
    logDone(index, eventNumber, latency, 'ERROR')
  }

  function logDone(index, eventNumber, latency, status) {
    console.info(`${identity(index)}: processed event ${eventNumber} ${status} in ${latency}ms`)
  }

  function identity(index) {
    return `SOCKET#${params.injectorId}_${index}`
  }

  function stopOne(index){
    return stopSingle(sockets[index]);
  }

  return {
    start: start,
    stop: stop,
    stopOne: stopOne,
    sendEvent: sendEvent
  };
}
