var hasFrom = require('./hasFrom')
var hasLimit = require('./hasLimit')
var hasOffset = require('./hasOffset')
var hasOrderBy = require('./hasOrderBy')
var hasUnion = require('./hasUnion')
var hasWhere = require('./hasWhere')
var orderByCondition = require('./orderByCondition')
var isSelect = require('./isSelect')
var resultSet = require('./resultSet')
var selectField = require('./selectField')
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

    if (json.DISTINCT) sql += 'DISTINCT '

    sql += json.SELECT.map(selectField).join(', ')
  }

  if (hasFrom(json)) {
    sql += ' FROM ' + json.FROM.map(resultSet(stringify)).join(' ')
  }

  if (hasWhere(json)) {
    sql += ' WHERE ' + whereConditions(stringify)(json.WHERE)
  }

  if (hasOrderBy(json)) {
    sql += ' ORDER BY ' + json.ORDER.map(orderByCondition).join(', ')
  }

  if (hasLimit(json)) {
    sql += ' LIMIT ' + json.LIMIT
  }

  if (hasOffset(json)) {
    sql += ' OFFSET ' + json.OFFSET
  }

  if (hasUnion(json)) {
    console.log(json)
    sql += ' UNION ' + json.UNION.map(stringify).join(' UNION ')
  }

  return sql
}

module.exports = stringify
