module.exports = (function() {
  const _program = require('commander')
  _program
    .option("-i, --injectorId <injectorId>", "the injector id")
    .option("-c, --connections <connections>", "the number of connections", parseFloat, 1)
    .option("-n, --numberOfEvents <numberOfEvents>", "the number of events to send", parseInt, 0)
    .option("--min-interval <minInterval>", "min interval between events", parseInt, 0)
    .option("--max-interval <maxInterval>", "max interval between events", parseFloat, 1)
    .option("-l, --lineal", "lineal execution (no timeouts)")
    .option("-a, --async", "asynchronous")
    .option("-s, --static-interval", "same interval between events")
    .option("-u, --server-url <serverUrl>", "the endpoint")
    .option("-g, --generator-path <generatorPath>", "the event generator path")
    .option("-o, --output <output>", "output json file path")

  return {
    parse
  }

  function parse() {
    _program.parse(process.argv)
    return get()
  }

  function get() {
    return {
      injectorId: _program.injectorId,
      numberOfEvents: _program.numberOfEvents,
      minInterval: _program.minInterval,
      maxInterval: _program.maxInterval,
      lineal: _program.lineal,
      async: _program.async,
      connections: _program.connections,
      staticInterval: _program.staticInterval,
      serverUrl: _program.serverUrl,
      generatorPath: _program.generatorPath,
      output: _program.output
    }
  }

})()
