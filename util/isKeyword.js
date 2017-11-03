var keywords = require('./keywords.json')

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

      if (keywords.indexOf(TOKEN) === -1) return false

      return keyword === TOKEN
    }
  } else {
    return function (token) {
      if (!token) return false

      var TOKEN = token.toUpperCase()

      return keywords.indexOf(TOKEN) > -1
    }
  }
}

module.exports = isKeyword
