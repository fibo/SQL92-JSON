var isValidName = require('./isValidName')
var isString = require('./isString')

function isFieldName (name) {
  if (!isString(name)) return false

  // A filed can be given as
  // * myfield
  // * mytable.myfield
  // * myschema.mytable.myfield
  var names = name.split('.')

  if ((names.length === 0) || (names.length > 3)) return false

  if (names.length === 1) {
    return isValidName(names[0])
  }

  if (names.length === 2) {
    return isValidName(names[0]) && isValidName(names[1])
  }

  if (names.length === 3) {
    return isValidName(names[0]) && isValidName(names[1]) && isValidName(names[2])
  }
}

module.exports = isFieldName
