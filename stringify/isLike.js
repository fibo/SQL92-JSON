var isSingleQuotedString = require('../util/isSingleQuotedString')

/**
 * Check that filter is a LIKE expression.
 *
 * { LIKE: '%foo' } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isLike (json) {
  var LIKE = json.LIKE

  return isSingleQuotedString(LIKE)
}

module.exports = isLike
