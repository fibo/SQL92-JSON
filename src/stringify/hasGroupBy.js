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
  var GROUPBY = json['GROUP BY']

  return Array.isArray(GROUPBY) && GROUPBY.length > 0 && GROUPBY.filter(isNumberOrString).length === GROUPBY.length
}

module.exports = hasGroupBy
