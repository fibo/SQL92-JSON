var isNumberOrString = require('../util/isNumberOrString')

/**
 * Check that expression has an ORDER BY.
 *
 * { ORDER: [1] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */
function hasOrderBy (json) {
  var ORDER = json.ORDER

  return Array.isArray(ORDER) && ORDER.length > 0 && ORDER.filter(isNumberOrString).length === ORDER.length
}

module.exports = hasOrderBy
