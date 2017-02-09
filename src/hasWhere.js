/**
 * Check that expression contains a WHERE.
 *
 * { } => false
 * { WHERE: [] } => false
 * { WHERE: [ yyyymmdd, { '=': 20170209 } ] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasWhere (json) {
  return Array.isArray(json.WHERE) && json.WHERE.length > 1
}

module.exports = hasWhere
