var isDataType = require('../util/isDataType')
var isFieldName = require('../util/isFieldName')
var isSingleQuotedString = require('../util/isSingleQuotedString')
var isStringNumber = require('../util/isStringNumber')

function stringField (field) {
  // Consider that a field could be casted, for example
  //
  // SELECT 1::VARCHAR

  var fieldName = field.split('::')[0]
  var dataType = field.split('::')[1]

  var fieldNameIsValid = isStringNumber(fieldName) || isSingleQuotedString(fieldName) || isFieldName(fieldName)

  if (dataType) {
    if (fieldNameIsValid && isDataType(dataType)) return field
  } else {
    if (fieldNameIsValid) return field
  }
}

module.exports = stringField
