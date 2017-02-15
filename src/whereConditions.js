var whereFilter = require('./whereFilter')

/**
 * A result set is given by a SQL statement.
 *
 * @param {Function} stringify
 *
 * @returns {Function} stringifyWhereConditions
 */

function whereConditions (stringify) {
 /**
  * Extract WHERE conditions.
  *
  * @param {Array} conditions
  *
  * @returns {String} result
  */

  return function stringifyWhereConditions (conditions) {
    var firstField = conditions.shift()
    var firstFilter = conditions.shift()

    var strinfigyFilter = whereFilter(stringify)

    var result = firstField + ' ' + strinfigyFilter(firstFilter)

    for (var i = 0; i < conditions.length; i++) {
      result += ' ' + strinfigyFilter(conditions[i])
    }

    return result
  }
}

module.exports = whereConditions
