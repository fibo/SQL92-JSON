function invalidTableName (tableName) {
  var message = 'Invalid table name'
  if (tableName) message += ': ' + tableName

  var error = new Error(message)
  error.tableName = tableName

  return error
}

module.exports = invalidTableName
