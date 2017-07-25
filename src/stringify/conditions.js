var filter = require('./filter')

/**
 * Extract filter conditions.
 *
 * @param {Function} stringify
 *
 * @returns {Function} stringifyConditions
 */

function conditions (stringify) {
  /**
  * @param {Array} conditions
  *
  * @returns {String} result
  */

  return function stringifyConditions (conditions) {
    var firstField = conditions.shift()
    var firstFilter = conditions.shift()

    var strinfigyFilter = filter(stringify)

    var result = firstField + ' ' + strinfigyFilter(firstFilter)

    for (var i = 0; i < conditions.length; i++) {
      result += ' ' + strinfigyFilter(conditions[i])
    }

    return result
  }
}

module.exports = conditions
