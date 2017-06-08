/**
 * Count how many tokens that are in given JSON.
 *
 * { SELECT: [1] } => 2
 * [ "a", { "=": "b" } ] => 3
 *
 * @params {String|Number|Array|Object} json
 *
 * @returns {Number} count
 */

function countTokens (json) {
  var count = 0
  var keys

  if (typeof json === 'number') return 1
  if (typeof json === 'string') return 1

  if (typeof json === 'object') {
    if (Array.isArray(json)) {
      for (var i = 0; i < json.length; i++) {
        count += countTokens(json[i])
      }
    } else {
      keys = Object.keys(json)

      for (var j = 0; j < keys.length; j++) {
        count += countTokens(json[keys[j]]) + 1
      }
    }
  }

  return count
}

module.exports = countTokens
