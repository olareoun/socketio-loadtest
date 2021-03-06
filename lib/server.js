#!/usr/bin/env node
const fs = require('fs')
const argsParser = require('./argsParser')
const params = argsParser.parse()
const generator = require(`${process.cwd()}/${params.generatorPath}`)
const fakesystem = require('./fakesystem')
const inspector = require('./inspector')()
const system = fakesystem({serverUrl: params.serverUrl}, params, generator, inspector)
let eventsCount = 0

system.start().then(function(what){
  console.log('Fake System started', params.injectorId)

  inspector.start()
  if (params.lineal) {
    startLineal()
  } else {
    if(params.async) {
      start()
      console.log('Sending events... Press Ctrl+C to stop.')
    } else {
      startSynchronous()
      console.log('Sending events (one at a time)... Press Ctrl+C to stop.')
    }
  }
})
.catch(function(err){
  console.log('Fake System cannot connect to dev server on ' + params.serverUrl + '.\nDid you forget to start it, young Padawan? )')
  console.log(err)
  process.exit()
})

function startLineal() {
  let requests = []
  for(let i = 0; i < params.numberOfEvents; i++) {
    let index = Math.floor(Math.random() * params.connections)
    ++eventsCount
    requests.push(system.sendEvent(index, eventsCount))
  }
  Promise.all(requests).then(exit).catch(function(err) {
    console.log('Nainonai', err)
  })
}

function start() {
  for(let i = 0; i < params.connections; i++) {
    startSynchronous(i)
  }
}

function startSynchronous(forcedIndex) {
  (function loop() {
    let index = forcedIndex
    if (index === undefined) {
      index = Math.floor(Math.random() * params.connections)
    }
    setTimeout(function() {
      if (!reachedEventsLimit()) {
        ++eventsCount
        system.sendEvent(index, eventsCount)
        .then(function(result){
          loop()
        })
        .catch(function(err){
          console.log('Error sending event', err)
          loop()
        })
      } else {
        system.stopOne(index)
        if (system.allDisconnected()){
          printSummary()
        }
      }
    }, calculateDelay())
  }())
}

function printSummary() {
  const prettySummary = JSON.stringify(inspector.summary(), null, "  ")
  if (!params.output) {
    console.info(prettySummary)
  } else {
    fs.writeFile(params.output, prettySummary, function(err) {
      if (err) {
        console.info("error writing summary: ", err)
        throw err
      }
    })
  }
}

function calculateDelay() {
  let diff = params.maxInterval - params.minInterval
  let delay = params.minInterval
  if(!params.staticInterval) {
    delay += Math.round(Math.random() * diff)
  }
  return delay
}

function reachedEventsLimit() {
  if (!params.numberOfEvents) return false
  return eventsCount >= params.numberOfEvents
}

process.on('SIGINT', exit)

function exit() {
  console.log("Stopping Fake System!\n\n")
  printSummary()
  process.exit()
}
