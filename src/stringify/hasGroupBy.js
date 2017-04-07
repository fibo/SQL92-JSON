var isNumberOrString = require('../util/isNumberOrString')

/**
 * Check that expression has a GROUP BY.
 *
 * { GROUP: [1] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasGroupBy (json) {
  var GROUP = json.GROUP

  return Array.isArray(GROUP) && GROUP.length > 0 && GROUP.filter(isNumberOrString).length === GROUP.length
}

module.exports = hasGroupBy
