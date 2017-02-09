var hasFrom = require('./hasFrom')
var hasLimit = require('./hasLimit')
var hasOffset = require('./hasOffset')
var hasWhere = require('./hasWhere')
var isSelect = require('./isSelect')
var whereConditions = require('./whereConditions')

/**
 * Convert JSON to SQL.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function stringify (json) {
  var sql = null

  if (isSelect(json)) {
    if (sql) sql += ' SELECT '
    else sql = 'SELECT '

    sql += json.SELECT.join(', ')
  }

  if (hasFrom(json)) {
    sql += ' FROM ' + json.FROM.join(' ')
  }

  if (hasWhere(json)) {
    sql += ' WHERE ' + whereConditions(json.WHERE)
  }

  if (hasLimit(json)) {
    sql += ' LIMIT ' + json.LIMIT
  }

  if (hasOffset(json)) {
    sql += ' OFFSET ' + json.OFFSET
  }

  return sql
}

module.exports = stringify
