var isValidName = require('./isValidName')
var isString = require('./isString')

function isTableName (name) {
  if (!isString(name)) return false

  // A table can be given as
  // * mytable
  // * myschema.mytable
  var names = name.split('.')

  if ((names.length === 0) || (names.length > 2)) return false

  if (names.length === 1) {
    return isValidName(names[0])
  }

  if (names.length === 2) {
    return isValidName(names[0]) && isValidName(names[1])
  }
}

module.exports = isTableName
