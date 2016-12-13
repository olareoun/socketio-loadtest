'use strict';
/**
 * A randome event generator
 * @type {Object}
 */
module.exports = {
  createEvent: generateEvent
};

//In order to test NULL values, you have to send an empty string OR undefined
//because sending null will break schema validation
var fields = {
    seid: ["source", "gas", "oil", "foo", "1234567890"],
    gs: ["RTS1", "RTS2", "Fleet", "FDS"],
    gss: ["GSS1"], //["hyfly", "flypan", "ODA", "VERIF", "LIMIT", ""],
    ob: ['OB1', 'OB2', 'OB3', 'OB4', ''],
    obs: ['OBS1', 'OBS2', ''],
    d: ["AB4FB", "AB5C", "NEWST", "BBDB5"],
    i: ["prime", "backup"],
    u: ["fake_sys"],
    h: ["PC1", "PC2", "PC3", "PC4"],
    sev: ['WARN', 'ERROR'],
    //msg: ["pues estaba yo dandole al boton de aterrizar, cuando de repente aparecio una mosca  el techo. ", "Meteorito impacta leva derecha", "explosion solar deshabilita los paneles de direccion", "desviacion de trayectoria notable", "perdida de astronauta en el espacio sideral", "nos quedamos sin gasolina", "mayday", "nuevo planeta descubierto"],
    msg: ["test1_1", "test2_2", "error enormous", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed nec semper risus. Cras vel pharetra ex. Proin aliquet justo quam. Mauris sit amet erat dolor. Suspendisse ac auctor risus. Maecenas felis lacus, vulputate sed pulvinar at posuere."],
    t: ["M", "A", "R", "N"],
    //whats this a???
    //a: ["fix it", "buy a new one", "replace the man", "destroy it"],
    s: ["Ryadh", "Madrid"],
    st: ['active']
}

function random(field) {
  var fieldRange = fields[field].length;
  return fields[field][Math.floor(Math.random() * fieldRange)];
}


function generateEvent() {
  var d = new Date();
  return {
    //note - no id, this is a system and gmv-server should assign ids
    seid: random("seid"),
    utc: d.toISOString(),
    gsT: d.toISOString(),    
    gs: random("gs"),
    gss: random("gss"),
    ob: random("ob"),
    obs: random("obs"),
    d: random("d"),
    i: random("i"),
    u: random("u"),
    h: random("h"),
    sev: random("sev"),
    msg: random("msg"),
    t: random("t"),
    s: random("s"),
    st: random("st"),
  }
}

function generateInitialEvents(x) {
  var events = [];
  for(var i = 0; i < x; i++) {
    events.push(generateEvent());
  }
  return events;
}

function generateInitialAlerts(x) {
  var alerts = [];
  generateInitialEvents(x).map(function(e) {
    if (e.sev !== "info" && e.st === false) {
      alerts.push(e);
    }
  });
  return alerts;
}
