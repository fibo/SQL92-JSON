/**
 * Check that expression contains a HAVING.
 *
 * { } => false
 * { HAVING: [] } => false
 * { HAVING: [ yyyymmdd, { '=': 20170209 } ] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasHaving (json) {
  return Array.isArray(json.HAVING) && json.HAVING.length > 1
}

module.exports = hasHaving
