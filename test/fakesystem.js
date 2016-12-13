'use strict'
const chai = require('chai')
const should = chai.should()
var systemFactory = require('../lib/fakesystem'),
    sinon = require('sinon')

describe('Fake External System', function(){
  describe('Interface', function(){
    it('Should be a factory Function', function(){
      systemFactory.should.be.an.Function
    })
    it('Should return an instance from factory', function(){
      var instance = systemFactory({})
      instance.should.be.an.Object
    })

    it('Should have start() and stop() methods', function(){
      var system = systemFactory({})
      system.start.should.be.a.Function
      system.stop.should.be.a.Function
    })

    it('Should return Promises from start() and stop() methods', function(){
      var system = systemFactory({})
      var promise = system.start()
      promise.should.be.a.Promise
      promise = system.stop()
      promise.should.be.a.Promise
    })

    xit('Should resolve start() promise if connection is OK', function(done){
      var system = systemFactory({
        serverUrl: 'http://127.0.0.1:3000/webclient',
        forceNew: true
      })
      system.start().then(function(res){
        res.should.be.an.Object.and.have.property('connected', true)
        system.stop()
        done()
      })
      .catch(function(err){
        console.log('Trying to connect to localhost:3000/webclient. Is the dev server running, mate???')
        should('Unable to connect to development server').fail(true)
        system.stop()
        done()
      })
    })

    xit('Should reject start() promise if connection fails', function(done){
      var system = systemFactory({
        serverUrl: 'http://localhost:9886',
        forceNew: true
      })
      system.start()
      .catch(function(err){
        err.should.be.an.Object.and.have.property('connected', false)
        err.should.have.property('error')
        system.stop()
        done()
      })
    })
  })

  // describe('Behaviour', function(){
  //   var system = systemFactory({
  //     forceNew: true,
  //     serverUrl: 'http://127.0.0.1:3000/webclient'
  //   })

  //   before(function(done){
  //     system.start()
  //       .then(function(){ done() })
  //       .catch(function(err){
  //         console.log('Trying to connect to localhost:3000/webclient. Is the dev server running, mate???')
  //         should.fail('Unable to connect to dev server')
  //         system.stop().then(done)

  //       })
  //   })

  //   after(function(done){
  //     system.stop().then(function(){ done() })
  //   })

  //   it('Should send an event into the system', function(done){
  //       //send an event!!!!
  //       system.sendEvent().then(function(){
  //         console.log('Event sent OK')
  //       })
  //       .catch(function(err){
  //         console.log('Event not accepted', err)
  //         should.fail('Event was not correctly sent')
  //       })
  //       .done(function(){
  //         system.stop()
  //         done()
  //       })
  //   })
  // })
})
