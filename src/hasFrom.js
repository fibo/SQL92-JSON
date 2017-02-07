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
  return Array.isArray(json.FROM) && json.FROM.length > 0
}

module.exports = hasFrom
