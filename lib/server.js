#!/usr/bin/env node
const argsParser = require('./argsParser')
const params = argsParser.parse()
console.log(`params ${JSON.stringify(params)}`)
const generator = require(`${process.cwd()}/${params.generatorPath}`)

const fakesystem = require('./fakesystem')

var system = fakesystem({serverUrl: params.serverUrl}, params, generator);
var eventsCount = 0;
var startTime;
var latencies = [];

system.start().then(function(){
  startTime = Date.now()
  console.log('Fake System started', startTime, params.injectorId);
  if (params.lineal) {
    startLineal();
  } else {
    if(params.async) {
      start();
      console.log('Sending events... Press Ctrl+C to stop.');
    } else {
      startSynchronous();
      console.log('Sending events (one at a time)... Press Ctrl+C to stop.');
    }
  }
})
.catch(function(err){
  console.log('Fake System cannot connect to dev server on ' + params.serverUrl + '.\nDid you forget to start it, young Padawan? ;)');
  console.log(err);
  process.exit();
});

function startLineal() {
  for(var i = 0; i < params.numberOfEvents; i++) {
    var index = Math.floor(Math.random() * params.connections);
    ++eventsCount
    system.sendEvent(index, eventsCount).then(function(){
      var now = Date.now();
      console.info("done in ", now - startTime)
    })
    .catch(function(err){
      console.log('Error sending event', err);
      console.log('Stopping process');
      system.stop()
    });
  }
}

function start() {
  for(var i = 0; i < params.connections; i++) {
    startSynchronous(i);
  }
}

function startSynchronous(forcedIndex) {
  (function loop() {
    console.info("_____media______", averageLatency())
    var index = forcedIndex || Math.floor(Math.random() * params.connections);
    setTimeout(function() {
      if (!reachedEventsLimit()) {
        ++eventsCount
        system.sendEvent(index, eventsCount).then(function(result){
          latencies.push(result.latency)
          var now = Date.now();
          console.info("done in ", now - startTime)
          loop();
        })
        .catch(function(err){
          latencies.push(err.latency)
          console.log('Error sending event', err);
          console.log('Stopping process');
          system.stopOne(index);
          loop();
        });
      }
    }, calculateDelay());
  }());
}

function averageLatency() {
  // console.info("latencies", latencies)
  if (!latencies.length) return 0;
  let sum = latencies.reduce(function(previous, current) {
    return current += previous
  }, 0);
  let avg = sum / latencies.length;
  return Math.floor(avg);
}

function calculateDelay() {
  var diff = params.maxInterval - params.minInterval,
      delay = params.minInterval;
  if(!params.staticInterval) {
    delay += Math.round(Math.random() * diff);
  }
  return delay;
}

function reachedEventsLimit() {
  if (!params.numberOfEvents) return false;
  return eventsCount >= params.numberOfEvents;
}

process.on('SIGINT', function() {
  console.log("Stopping Fake System!\n\n");
  // if(i_should_exit)
  process.exit();
});
