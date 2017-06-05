var aliasExpression = require('./aliasExpression')
var isString = require('../util/isString')

/**
 * Stringify SUM expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function sumExpression (json) {
  var result = ''

  var SUM = json.SUM

  if (isString(SUM)) result = 'SUM(' + SUM + ')'

  return result + aliasExpression(json)
}

module.exports = sumExpression
