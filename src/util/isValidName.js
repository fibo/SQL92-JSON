var isString = require('./isString')

function isValidName (name) {
  if (!isString(name)) return false

  return /^[a-zA-Z_][a-zA-Z_0-9]+$/.test(name)
}

module.exports = isValidName
