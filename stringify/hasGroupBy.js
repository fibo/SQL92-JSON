var isNumberOrString = require('../util/isNumberOrString')

/**
 * Check that expression has a GROUP BY.
 *
 * { 'GROUP BY': [1] } => true
 * { 'GROUP BY': ['name'] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasGroupBy (json) {
  var GROUP_BY = json['GROUP BY']

  return Array.isArray(GROUP_BY) && GROUP_BY.length > 0 && GROUP_BY.filter(isNumberOrString).length === GROUP_BY.length
}

module.exports = hasGroupBy
