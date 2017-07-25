var aliasExpression = require('./aliasExpression')

/**
 * Stringify NVL expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function nvlExpression (json) {
  var result = ''

  var NVL = json.NVL

  result = 'NVL(' + NVL[0] + ', ' + NVL[1] + ')'

  return result + aliasExpression(json)
}

module.exports = nvlExpression
