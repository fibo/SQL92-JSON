function invalidAlias (alias) {
  var message = 'Invalid alias'
  if (alias) message += ': ' + JSON.stringify(alias)

  var error = new Error(message)
  error.alias = alias

  return error
}

module.exports = invalidAlias
