function couldNotParseSelectField (field) {
  var message = 'Could not parse select field'
  if (field) message = message + ' ' + JSON.stringify(field)

  var error = new TypeError(message)
  error.field = field

  return error
}

exports.couldNotParseSelectField

function functionRequired (functionName) {
  var message = 'Function required'
  if (functionName) message += ': ' + functionName

  var error = new Error(message)
  error.functionName = functionName

  return error
}

exports.functionRequired

function invalidAlias (alias) {
  var message = 'Invalid alias'
  if (alias) message += ': ' + JSON.stringify(alias)

  var error = new Error(message)
  error.alias = alias

  return error
}

exports.invalidAlias

function invalidDataType (dataType) {
  var message = 'Invalid data type'
  if (dataType) message += ': ' + dataType

  var error = new Error(message)
  error.dataType = dataType

  return error
}

exports.invalidDataType

function invalidInterval (left, right) {
  var message = 'invalid interval'
  if (left || right) message += ':'
  if (left) message += ' ' + left
  if (right) message += ' ' + right

  var error = new Error(message)
  error.left = left
  error.right = right

  return error
}

exports.invalidInterval

function invalidJSONData (data) {
  var message = 'Invalid JSON data'
  if (data) message += ': ' + JSON.stringify(data)

  var error = new Error(message)
  error.data = data

  return error
}

exports.invalidJSONData

function invalidSQL (sql) {
  var message = 'Invalid SQL'
  if (sql) message += ': ' + sql

  var error = new Error(message)
  error.sql = sql

  return error
}

exports.invalidSQL

function invalidTableName (tableName) {
  var message = 'Invalid table name'
  if (tableName) message += ': ' + tableName

  var error = new Error(message)
  error.tableName = tableName

  return error
}

exports.invalidTableName

function unclosedParenthesisExpression (tokens) {
  var message = 'Unclosed parenthesis'

  var error = new Error(message)
  error.tokens = tokens

  return error
}

exports.unclosedParenthesisExpression
