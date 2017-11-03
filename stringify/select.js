var conditions = require('./conditions')
var groupByCondition = require('./groupByCondition')
var hasFrom = require('./hasFrom')
var hasLimit = require('./hasLimit')
var hasOffset = require('./hasOffset')
var hasGroupBy = require('./hasGroupBy')
var hasHaving = require('./hasHaving')
var hasOrderBy = require('./hasOrderBy')
var hasUnion = require('./hasUnion')
var hasUnionAll = require('./hasUnionAll')
var hasWhere = require('./hasWhere')
var orderByCondition = require('./orderByCondition')
var resultSet = require('./resultSet')
var selectField = require('./selectField')

/**
 * Stringify SELECT statement.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function select (json) {
  var sql = 'SELECT '

  if (json.DISTINCT) sql += 'DISTINCT '

  sql += json.SELECT.map(function (field) { return selectField(field, select) }).join(', ')

  if (hasFrom(json)) {
    sql += ' FROM ' + json.FROM.map(resultSet(select)).join(' ')
  }

  if (hasWhere(json)) {
    sql += ' WHERE ' + conditions(select)(json.WHERE)
  }

  if (hasGroupBy(json)) {
    sql += ' GROUP BY ' + json['GROUP BY'].map(groupByCondition).join(', ')

    if (hasHaving(json)) {
      sql += ' HAVING ' + conditions(select)(json.HAVING)
    }
  }

  if (hasOrderBy(json)) {
    sql += ' ORDER BY ' + json['ORDER BY'].map(orderByCondition).join(', ')
  }

  if (hasLimit(json)) {
    sql += ' LIMIT ' + json.LIMIT
  }

  if (hasOffset(json)) {
    sql += ' OFFSET ' + json.OFFSET
  }

  if (hasUnion(json)) {
    sql += ' UNION ' + select(json.UNION)
  }

  if (hasUnionAll(json)) {
    sql += ' UNION ALL ' + select(json['UNION ALL'])
  }

  return sql
}

module.exports = select
