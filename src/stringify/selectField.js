var countExpression = require('./countExpression')
var isDataType = require('../util/isDataType')
var isFieldName = require('../util/isFieldName')
var isNumber = require('../util/isNumber')
var isObject = require('../util/isObject')
var isSingleQuotedString = require('../util/isSingleQuotedString')
var isStringNumber = require('../util/isStringNumber')
var isStar = require('../util/isStar')
var isString = require('../util/isString')

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

  if (isString(field)) {
    // Consider that a field could be casted, for example
    //
    // SELECT 1::VARCHAR

    var fieldName = field.split('::')[0]
    var dataType = field.split('::')[1]

    if (dataType) {
      var fieldNameIsValid = isStringNumber(fieldName) || isSingleQuotedString(fieldName) || isFieldName(fieldName)

      if (fieldNameIsValid && isDataType(dataType)) return field
    } else {
      if (isFieldName(fieldName)) return field
    }
  }

  if (isObject(field)) {
    if (field.COUNT) {
      return countExpression(field)
    }
  }

  // Should not arrive here.

  var message = 'Could not parse select field'
  if (field) message = message + ' ' + field
  var error = new TypeError(message)
  error.field = field
  throw error
}

module.exports = selectField