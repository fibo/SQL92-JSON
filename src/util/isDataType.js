var dataTypes = require('../dataTypes.json')

function isDataType (token) {
  var TOKEN = token.toUpperCase()

  return dataTypes.indexOf(TOKEN) > -1
}

module.exports = isDataType
