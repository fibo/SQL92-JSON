var conditions = require('./conditions')
var encloseWithParenthesis = require('../util/encloseWithParenthesis')
var getTableNameAlias = require('./getTableNameAlias')
var getTableNameWithAlias = require('./getTableNameWithAlias')
var getResultSetAlias = require('./getResultSetAlias')
var getResultSetWithAlias = require('./getResultSetWithAlias')
var getJoinKeyword = require('./getJoinKeyword')
var isTableName = require('../util/isTableName')
var isSelect = require('./isSelect')

/**
 * A result set is given by a table name or a SELECT statement.
 *
 * @param {Function} select
 *
 * @returns {Function} stringifyResultSet
 */

function resultSet (select) {
  /**
  * Stringify resultset
  *
  * @param {String|Object} statement
  * @param {Boolean} [notFirstJoin]
  *
  * @returns {String} result
  */

  return function stringifyResultSet (statement, notFirstJoin) {
    if (isTableName(statement)) {
      return statement
    }

    if (isSelect(statement)) {
      return encloseWithParenthesis(select(statement))
    }

    var result = ''

    var resultSetWithAlias = getResultSetWithAlias(statement)

    if (resultSetWithAlias) {
      var resultSetAlias = getResultSetAlias(resultSetWithAlias)
      var resultSetObj = resultSetWithAlias[resultSetAlias]

      result = encloseWithParenthesis(select(resultSetObj)) + ' ' + resultSetAlias

      // TODO implement JOIN also here

      return result
    }

    var tableNameWithAlias = getTableNameWithAlias(statement)

    if (tableNameWithAlias) {
      var tableAlias = getTableNameAlias(tableNameWithAlias)
      var tableName = tableNameWithAlias[tableAlias]
      var joinKeyword = getJoinKeyword(statement)
      var joinObj = statement[joinKeyword]

      if (joinKeyword) {
        result = notFirstJoin ? '' : tableName + ' ' + tableAlias + ' '

        var joinTableNameWithAlias = getTableNameWithAlias(joinObj)

        if (joinTableNameWithAlias) {
          var joinTableAlias = getTableNameAlias(joinTableNameWithAlias)
          var joinTableName = joinTableNameWithAlias[joinTableAlias]
          var onCondition = joinObj.ON.slice(0)

          result += [joinKeyword, joinTableName, joinTableAlias].join(' ')
          result += ' ON ' + conditions(select)(onCondition)
        }

        // TODO statement like JOIN (select * from table) t
        // use getResultSetWithAlias()

        var nextJoinKeyword = getJoinKeyword(joinObj)

        if (nextJoinKeyword) {
          var nextJoinStatement = {}
          notFirstJoin = true
          nextJoinStatement[nextJoinKeyword] = joinObj[nextJoinKeyword]
          result += ' ' + stringifyResultSet(joinObj, notFirstJoin)
        }
      } else {
        // No JOIN found.
        result = tableName + ' ' + tableAlias
      }

      return result
    }
  }
}

module.exports = resultSet
