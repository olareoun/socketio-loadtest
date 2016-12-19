const Utils = require('./utils')

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
    const latencies = requestKeys()
      .map(calculateLatency)
      .filter(notALatency)
    return latencies
  }

  function notALatency(value) {
    return !isNaN(value)
  }

  function calculateLatency(ev) {
    const request = getRequest(ev)
    return request.end - request.start
  }

  function successRequestsCount() {
    return requestsData().filter((item) => item.status === SUCCESS).length
  }

  function errorRequestsCount() {
    return requestsData().filter((item) => item.status === ERROR).length
  }

  function requestsData() {
    return requestKeys().map(getRequest)
  }

  function requestsCount() {
    return requestKeys().length
  }

  function getRequest(id) {
    return _data.requests[id]
  }

  function start() {
    _data.start = Date.now()
  }

  function requestKeys() {
    return Object.keys(_data.requests)
  }

}

