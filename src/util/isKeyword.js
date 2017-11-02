var functions = require('../functions.json')
var keywords = require('../keywords.json')
var setOperators = require('../setOperators.json')

var allKeywords = keywords.concat(functions).concat(setOperators)

/**
 * Tells if a token is a SQL keyword.
 *
 * There are two ways to use it.
 *
 * 1. Any keyword.
 *
 * isKeyword()('foo') => false
 * isKeyword()('count') => true
 *
 * 2. Specific keyword.
 *
 * var isCount = isKeyword('COUNT')
 * isCount('Count') => true
 * isCount('MAX') => false
 * isCount('foo') => false
 * isCount() => false
 */

function isKeyword (keyword) {
  if (keyword) {
    return function (token) {
      if (!token) return false

      var TOKEN = token.toUpperCase()

      if (allKeywords.indexOf(TOKEN) === -1) return false

      return keyword === TOKEN
    }
  } else {
    return function (token) {
      if (!token) return false

      var TOKEN = token.toUpperCase()

      return allKeywords.indexOf(TOKEN) > -1
    }
  }
}

module.exports = isKeyword
