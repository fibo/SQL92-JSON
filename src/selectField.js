var countExpression = require('./countExpression')
var isFieldName = require('./util/isFieldName')
var isNumber = require('./util/isNumber')
var isObject = require('./util/isObject')
var isStar = require('./util/isStar')

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

  if (isFieldName(field)) return field

  if (isObject(field)) {
    if (field.COUNT) {
      return countExpression(field)
    }
  }
}

module.exports = selectField
