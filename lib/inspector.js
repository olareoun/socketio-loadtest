const Utils = require('./utils')
const Chalk = require('chalk')

const SUCCESS = 'success'
const ERROR = 'error'

module.exports = function() {
  let _data = {
    errors: {},
    requests: {}
  }

  return {
    start,
    summary,
    startRequest,
    successRequest,
    errorRequest
  }

  function startRequest(eventNumber) {
    _data.requests[eventNumber] = { start: Date.now() }
  }

  function successRequest(eventNumber) {
    _data.requests[eventNumber].end = Date.now()
    _data.requests[eventNumber].status = SUCCESS
  }

  function errorRequest(eventNumber, result) {
    _data.errors[result.errorCode] = _data.errors[result.errorCode] || 0
    _data.errors[result.errorCode]++
    _data.requests[eventNumber].end = Date.now()
    _data.requests[eventNumber].status = ERROR
  }

  function summary() {
    const startedAt =new Date(_data.start).toLocaleString()
    const requests = {
      total: requestsCount(),
      success: successRequestsCount(),
      error: errorRequestsCount(),
    }
    const latency = {
      average: averageLatency(),
      max: maxLatency(),
      min: minLatency()
    }
    Object.keys(_data.errors).forEach((errorCode) => {
      latency.errors = Object.assign({}, _data.errors)
    })
    const now = Date.now()
    const exitedAt = new Date(now).toLocaleString()
    const duration = Utils.formatDuration(now - _data.start)

    return {
      startedAt,
      requests,
      latency,
      exitedAt,
      duration
    }
  }

  function averageLatency() {
    const latencies = calculateLatencies()
    return Utils.average(latencies)
  }

  function maxLatency() {
    const latencies = calculateLatencies()
    return Utils.max(latencies)
  }

  function minLatency() {
    const latencies = calculateLatencies()
    return Utils.min(latencies)
  }

  function calculateLatencies() {
    const latencies = Object.keys(_data.requests).map((ev) => {
      return _data.requests[ev].end - _data.requests[ev].start
    })
    return latencies
  }

  function successRequestsCount() {
    return requestsData().filter((item) => item.status === SUCCESS).length
  }

  function errorRequestsCount() {
    return requestsData().filter((item) => item.status === ERROR).length
  }

  function requestsData() {
    return Object.keys(_data.requests).map((key) => _data.requests[key])
  }

  function requestsCount() {
    return Object.keys(_data.requests).length
  }

  function start() {
    _data.start = Date.now()
  }

}

