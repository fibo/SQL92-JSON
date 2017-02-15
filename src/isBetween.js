var isNumberOrString = require('./util/isNumberOrString')

/**
 * Check that filter is a BETWEEN expression.
 *
 * { BETWEEN: [10, 20] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isBetween (json) {
  var BETWEEN = json.BETWEEN

  return Array.isArray(BETWEEN) && BETWEEN.length === 2 && isNumberOrString(BETWEEN[0]) && isNumberOrString(BETWEEN[1])
}

module.exports = isBetween
