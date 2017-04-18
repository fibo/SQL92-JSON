  function invalidSQL (sql) {
    var message = 'Invalid SQL'
    if (sql) message += ': ' + sql

    var error = new Error(message)
    error.sql = sql

    return error
  }

  module.exports = invalidSQL
