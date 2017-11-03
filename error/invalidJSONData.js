function invalidJSONData (data) {
  var message = 'Invalid JSON data'
  if (data) message += ': ' + JSON.stringify(data)

  var error = new Error(message)
  error.data = data

  return error
}

module.exports = invalidJSONData
