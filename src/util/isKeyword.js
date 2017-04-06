var keywords = require('../keywords.json')
var functions = require('../functions.json')

function isKeyword (keyword) {
  return function (token) {
    var TOKEN = token.toUpperCase()

    if (keywords.concat(functions).indexOf(TOKEN) === -1) return false

    return keyword === TOKEN
  }
}

module.exports = isKeyword
