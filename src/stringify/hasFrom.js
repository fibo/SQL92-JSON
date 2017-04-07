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

  return Array.isArray(FROM) && FROM.length > 0
}

module.exports = hasFrom
