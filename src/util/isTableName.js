var isKeyword = require('./isKeyword')
var isString = require('./isString')
var isValidName = require('./isValidName')

function isTableName (token) {
  if (!isString(token)) return false

  if (isKeyword()(token)) return false

  // A table can be given as
  //
  // * mytable
  // * myschema.mytable
  //
  var names = token.split('.')

  if ((names.length === 0) || (names.length > 2)) return false

  if (names.length === 1) {
    return isValidName(names[0])
  }

  if (names.length === 2) {
    return isValidName(names[0]) && isValidName(names[1])
  }
}

module.exports = isTableName
