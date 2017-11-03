var aliasExpression = require('./aliasExpression')
var isString = require('../util/isString')
var stringField = require('./stringField')

/**
 * Stringify unary function expression, like MAX, MIN, UPPER, LOWER.
 *
 * @param {String} functionName
 *
 * @returns {String} result
 */

function unaryFunction (functionName) {
  /**
  * @param {Object} json
  *
  * @returns {String} result
  */

  return function (json) {
    var result = ''

    var expression = json[functionName]

    // TODO
    // 1. isString should be isField
    // 2. should check for math expressions and other stuff
    if (isString(expression)) {
      result = functionName + '(' + stringField(expression) + ')'
    }

    return result + aliasExpression(json)
  }
}

module.exports = unaryFunction
