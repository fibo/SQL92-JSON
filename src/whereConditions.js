var whereFilter = require('./whereFilter')

/**
 * Extract WHERE conditions.
 *
 * @param {Array} conditions
 *
 * @returns {String} result
 */

function whereConditions (conditions) {
  var firstField = conditions[0]
  var firstFilter = conditions[1]

  var result = firstField + ' ' + whereFilter(firstFilter)

  return result
}

module.exports = whereConditions
