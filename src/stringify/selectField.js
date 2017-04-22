var error = require('../error')

var aliasExpression = require('./aliasExpression')
var countExpression = require('./countExpression')
// var isMathOperator = require('../util/isMathOperator')
var isNumber = require('../util/isNumber')
var isObject = require('../util/isObject')
// var isStringOperator = require('../util/isStringOperator')
var isStar = require('../util/isStar')
var isString = require('../util/isString')
var stringField = require('./stringField')

/**
 * Map columns in a SELECT.
 *
 * @param {Number|String|Object} field
 *
 * @returns {String} result
 */

function selectField (field) {
  // Check if field is a math or string expression.
  if (Array.isArray(field)) {
    // TODO improve this using isMathOperator and isStringOperator
    return field.join(' ')
  }

  if (isStar(field)) return field

  if (isNumber(field)) return field

  if (isString(field)) {
    return stringField(field)
  }

  if (isObject(field)) {
    if (field.COUNT) {
      return countExpression(field)
    }

    if (field.AS) {
      return aliasExpression(field)
    }
  }

  // Should not arrive here.
  throw error.couldNotParseSelectField(field)
}

module.exports = selectField
