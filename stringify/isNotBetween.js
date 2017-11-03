var isNumberOrString = require('../util/isNumberOrString')

/**
 * Check that filter is a NOT BETWEEN expression.
 *
 * { 'NOT BETWEEN': [10, 20] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isNotBetween (json) {
  var NOT_BETWEEN = json['NOT BETWEEN']

  return Array.isArray(NOT_BETWEEN) && NOT_BETWEEN.length === 2 && isNumberOrString(NOT_BETWEEN[0]) && isNumberOrString(NOT_BETWEEN[1])
}

module.exports = isNotBetween
