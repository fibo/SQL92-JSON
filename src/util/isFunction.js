var functions = require('../functions.json')

function isFunction (token) {
  var TOKEN = token.toUpperCase()

  return functions.indexOf(TOKEN) > -1
}

module.exports = isFunction
