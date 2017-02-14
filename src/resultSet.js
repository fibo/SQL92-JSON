var encloseWithParenthesis = require('./util/encloseWithParenthesis')
var isNoun = require('./util/isNoun')
var isSelect = require('./isSelect')
var isString = require('./util/isString')

/**
 * A result set is given by a SQL statement.
 *
 * @param {Function} stringify
 *
 * @returns {Function} result
 */

function resultSet (stringify) {
  return function (statement) {
    if (isString(statement) && isNoun(statement)) {
      return statement
    }

    if (isSelect(statement)) {
      return encloseWithParenthesis(stringify(statement))
    }
  }
}

module.exports = resultSet
