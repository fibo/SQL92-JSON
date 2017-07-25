var conditions = require('./conditions')
var encloseWithParenthesis = require('../util/encloseWithParenthesis')
var getTableNameAlias = require('./getTableNameAlias')
var getTableNameWithAlias = require('./getTableNameWithAlias')
var getJoinKeyword = require('./getJoinKeyword')
var isTableName = require('../util/isTableName')
var isSelect = require('./isSelect')

/**
 * A result set is given by a table name or a SQL statement.
 *
 * @param {Function} stringify
 *
 * @returns {Function} stringifyResultSet
 */

function resultSet (stringify) {
  /**
  * Stringify resultset
  *
  * @param {String|Object} statement
  * @param {Boolean} notFirstJoin
  *
  * @returns {String} result
  */

  return function stringifyResultSet (statement, notFirstJoin) {
    if (isTableName(statement)) {
      return statement
    }

    if (isSelect(statement)) {
      return encloseWithParenthesis(stringify(statement))
    }

    var tableNameWithAlias = getTableNameWithAlias(statement)

    if (tableNameWithAlias) {
      var tableAlias = getTableNameAlias(tableNameWithAlias)
      var tableName = tableNameWithAlias[tableAlias]
      var result = notFirstJoin ? '' : tableName + ' ' + tableAlias + ' '

      var joinKeyword = getJoinKeyword(statement)
      var joinJSON = statement[joinKeyword]

      if (joinKeyword) {
        var joinTableNameWithAlias = getTableNameWithAlias(joinJSON)

        if (joinTableNameWithAlias) {
          var joinTableAlias = getTableNameAlias(joinTableNameWithAlias)
          var joinTableName = joinTableNameWithAlias[joinTableAlias]
          var onCondition = joinJSON.ON.slice(0)

          result += [joinKeyword, joinTableName, joinTableAlias].join(' ')
          result += ' ON ' + conditions(stringify)(onCondition)
        }
        // TODO statement like JOIN (select * from table) t

        var nextJoinKeyword = getJoinKeyword(joinJSON)

        if (nextJoinKeyword) {
          var nextJoinStatement = {}
          notFirstJoin = true
          nextJoinStatement[nextJoinKeyword] = joinJSON[nextJoinKeyword]
          result += ' ' + stringifyResultSet(joinJSON, notFirstJoin)
        }
      }

      return result
    }
  }
}

module.exports = resultSet
