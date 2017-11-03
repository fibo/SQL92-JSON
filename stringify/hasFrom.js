var error = require('../error')

/**
 * Check that expression has a SELECT.
 *
 * { FROM: ['mytable'] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasFrom (json) {
  var FROM = json.FROM

  if (FROM) {
    if (Array.isArray(FROM) && FROM.length > 0) {
      return true
    } else {
      throw error.invalidJSONData({ FROM: FROM })
    }
  } else {
    return false
  }
}

module.exports = hasFrom
