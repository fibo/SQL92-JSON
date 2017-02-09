/**
 * Check that expression contains a LIMIT.
 *
 * { LIMIT: 100 } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasLimit (json) {
  var limit = json.LIMIT

  return typeof limit === 'number' && limit > 0
}

module.exports = hasLimit
