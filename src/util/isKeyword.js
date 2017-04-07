var keywords = require('../keywords.json')
var functions = require('../functions.json')

var allKeywords = keywords.concat(functions)

/**
 * Tells if a keyword is some token or a specific token.
 *
 * There are two ways to use it.
 *
 * isKeyword()('foo') => false
 * isKeyword()('count') => true
 *
 * var isCount = isKeyword('COUNT')
 * isCount('Count') => true
 * isCount('MAX') => false
 * isCount('foo') => false
 */

function isKeyword (keyword) {
  if (keyword) {
    return function (token) {
      var TOKEN = token.toUpperCase()

      if (allKeywords.indexOf(TOKEN) === -1) return false

      return keyword === TOKEN
    }
  } else {
    return function (token) {
      var TOKEN = token.toUpperCase()

      return allKeywords.indexOf(TOKEN) > -1
    }
  }
}

module.exports = isKeyword
