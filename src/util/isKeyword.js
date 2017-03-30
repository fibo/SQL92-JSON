var keywords = require('../keywords.json')

function isKeyword (keyword) {
  return function (token) {
    var TOKEN = token.toUpperCase()

    if (keywords.indexOf(TOKEN) === -1) return false

    return keyword === TOKEN
  }
}

module.exports = isKeyword
