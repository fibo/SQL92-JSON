var error = require('../error')
var isDataType = require('./isDataType')

function isCastedValue (token) {
  var dataType = token.split('::')[1]

  if (dataType) {
    if (isDataType(dataType)) {
      return true
    } else {
      throw error.invalidDataType(dataType)
    }
  } else {
    return false
  }
}

module.exports = isCastedValue
