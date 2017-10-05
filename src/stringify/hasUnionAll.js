var isSelect = require('./isSelect')

/**
 * Check that expression has a UNION ALL.
 *
 * { SELECT: 2, 'UNION ALL': [ { SELECT: 1 } ] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasUnionAll (json) {
  var UNION_ALL = json['UNION ALL']

  return UNION_ALL && isSelect(UNION_ALL)
}

module.exports = hasUnionAll
