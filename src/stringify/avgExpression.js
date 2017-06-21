var error = require('../error')

var aliasExpression = require('./aliasExpression')
var isString = require('../util/isString')

/**
 * Stringify AVG expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function avgExpression (json) {
  var result = ''

  var AVG = json.AVG

  if (isString(AVG)) {
    result = 'AVG(' + AVG + ')'
    return result + aliasExpression(json)
  }

  // Should not arrive here.
  throw error.couldNotParseSelectField(AVG)
}

module.exports = avgExpression
