var partialKeywords = require('./partialKeywords.json')

function isPartialKeyword (token) {
  var TOKEN = token.toUpperCase()

  return partialKeywords.indexOf(TOKEN) > -1
}

module.exports = isPartialKeyword
