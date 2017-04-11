function errorDataType (dataType) {
  var message = 'Invalid data type'
  if (dataType) message += ': ' + dataType

  var error = new Error(message)
  error.dataType = dataType

  return error
}

module.exports = errorDataType
