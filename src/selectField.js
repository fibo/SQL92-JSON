var countExpression = require('./countExpression')
var isNoun = require('./util/isNoun')
var isNumber = require('./util/isNumber')
var isObject = require('./util/isObject')
var isStar = require('./util/isStar')
var isString = require('./util/isString')

/**
 * Columns in a SELECT.
 *
 * @param {Number|String|Object} field
 *
 * @returns {String} result
 */

function selectField (field) {
  if (isStar(field)) return field

  if (isNumber(field)) return field

  if (isString(field) && isNoun(field)) return field

  if (isObject(field)) {
    if (field.COUNT) {
      return countExpression(field)
    }
  }
}

module.exports = selectField
