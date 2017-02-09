/**
 * Check that expression contains an OFFSET.
 *
 * { OFFSET: 0 } => false
 * { OFFSET: 100 } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasOffset (json) {
  var offset = json.OFFSET

  return typeof offset === 'number' && offset > 0
}

module.exports = hasOffset
