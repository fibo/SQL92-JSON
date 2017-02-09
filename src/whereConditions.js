var whereFilter = require('./whereFilter')

/**
 * Extract WHERE conditions.
 *
 * @param {Array} conditions
 *
 * @returns {String} result
 */

function whereConditions (conditions) {
  var firstField = conditions.shift()
  var firstFilter = conditions.shift()

  var result = firstField + ' ' + whereFilter(firstFilter)

  for (var i = 0; i < conditions.length; i++) {
    result += ' ' + whereFilter(conditions[i])
  }

  return result
}

module.exports = whereConditions
