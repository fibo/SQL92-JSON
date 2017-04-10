var isNumberOrString = require('../util/isNumberOrString')

/**
 * Check that expression has an ORDERBY BY.
 *
 * { 'ORDER BY': [1] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasOrderBy (json) {
  var ORDERBY = json['ORDER BY']

  return Array.isArray(ORDERBY) && ORDERBY.length > 0 && ORDERBY.filter(isNumberOrString).length === ORDERBY.length
}

module.exports = hasOrderBy
