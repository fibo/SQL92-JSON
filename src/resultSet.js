var encloseWithParenthesis = require('./util/encloseWithParenthesis')
var isTableName = require('./util/isTableName')
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
  *
  * @returns {String} result
  */

  return function stringifyResultSet (statement) {
    if (isTableName(statement)) {
      return statement
    }

    if (isSelect(statement)) {
      return encloseWithParenthesis(stringify(statement))
    }
  }
}

module.exports = resultSet
