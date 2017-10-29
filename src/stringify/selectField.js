var error = require('../error')

var aliasExpression = require('./aliasExpression')
var avgExpression = require('./avgExpression')
var countExpression = require('./countExpression')
// var isMathOperator = require('../util/isMathOperator')
var encloseWithParenthesis = require('../util/encloseWithParenthesis')
var isNumber = require('../util/isNumber')
var isObject = require('../util/isObject')
// var isStringOperator = require('../util/isStringOperator')
var isSelect = require('./isSelect')
var isStar = require('../util/isStar')
var isString = require('../util/isString')
var maxExpression = require('./maxExpression')
var minExpression = require('./minExpression')
var nvlExpression = require('./nvlExpression')
var stringField = require('./stringField')
var sumExpression = require('./sumExpression')

/**
 * Map columns in a SELECT.
 *
 * @param {Number|String|Object} field
 * @param {Function} [select]
 *
 * @returns {String} result
 */

function selectField (field, select) {
  // Field could be a subquery.

  if (isSelect(field)) {
    if (typeof select === 'function') {
      return encloseWithParenthesis(select(field))
    } else {
      throw error.functionRequired('select')
    }
  }

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
    if (field.AVG) {
      return avgExpression(field)
    }

    if (field.COUNT) {
      return countExpression(field)
    }

    if (field.MAX) {
      return maxExpression(field)
    }

    if (field.MIN) {
      return minExpression(field)
    }

    if (field.NVL) {
      return nvlExpression(field)
    }

    if (field.SUM) {
      return sumExpression(field)
    }

    // Check if it is an alias. This must be the last check since
    // other expressions can contain aliases.
    // I could also be an aliased sub query.
    if (field.AS) {
      return aliasExpression(field, select)
    }
  }

  // Should not arrive here.
  throw error.couldNotParseSelectField(field)
}

module.exports = selectField
