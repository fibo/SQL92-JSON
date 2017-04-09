var isSelect = require('./isSelect')

/**
 * Check that expression has a UNION.
 *
 * { SELECT: 2, UNION: [ { SELECT: 1 } ] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasUnion (json) {
  var UNION = json.UNION

  return UNION && isSelect(UNION)
}

module.exports = hasUnion
