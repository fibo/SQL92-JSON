var countExpression = require('./countExpression')
// var isDataType = require('./util/isDataType')
var isFieldName = require('./util/isFieldName')
var isNumber = require('./util/isNumber')
var isObject = require('./util/isObject')
var isStar = require('./util/isStar')

/**
 * Map columns in a SELECT.
 *
 * @param {Number|String|Object} field
 *
 * @returns {String} result
 */

function selectField (field) {
  if (isStar(field)) return field

  if (isNumber(field)) return field

  // TODO check if it contains a cast.
  if (isFieldName(field)) return field

  if (isObject(field)) {
    if (field.COUNT) {
      return countExpression(field)
    }
  }
}

module.exports = selectField
