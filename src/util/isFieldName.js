var isValidName = require('./isValidName')
var isString = require('./isString')

function isFieldName (name) {
  if (!isString(name)) return false

  // A filed can be given as
  // * myfield
  // * mytable.myfield
  // * myschema.mytable.myfield
  var names = name.split('.')

  var name0 = names[0]
  var name1 = names[1]
  var name2 = names[2]

  if ((names.length === 0) || (names.length > 3)) return false

  if (names.length === 1) {
    return isValidName(name0)
  }

  if (names.length === 2) {
    return isValidName(name0) && isValidName(name1)
  }

  if (names.length === 3) {
    return isValidName(name0) && isValidName(name1) && isValidName(name2)
  }
}

module.exports = isFieldName
