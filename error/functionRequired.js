function functionRequired (functionName) {
  var message = 'Function required'
  if (functionName) message += ': ' + functionName

  var error = new Error(message)
  error.functionName = functionName

  return error
}

module.exports = functionRequired
