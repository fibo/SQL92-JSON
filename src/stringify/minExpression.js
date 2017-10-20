var aliasExpression = require('./aliasExpression')
var isString = require('../util/isString')

/**
 * Stringify MIN expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function minExpression (json) {
  var result = ''

  var MIN = json.MIN

  if (isString(MIN)) result = 'MIN(' + MIN + ')'

  return result + aliasExpression(json)
}

module.exports = minExpression
