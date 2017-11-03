var aliasExpression = require('./aliasExpression')
var isString = require('../util/isString')

/**
 * Stringify MAX expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function maxExpression (json) {
  var result = ''

  var MAX = json.MAX

  if (isString(MAX)) result = 'MAX(' + MAX + ')'

  return result + aliasExpression(json)
}

module.exports = maxExpression
