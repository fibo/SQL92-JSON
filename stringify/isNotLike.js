var isSingleQuotedString = require('../util/isSingleQuotedString')

/**
 * Check that filter is a NOT LIKE expression.
 *
 * { 'NOT LIKE': '%foo' } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isNotLike (json) {
  var NOT_LIKE = json['NOT LIKE']

  return isSingleQuotedString(NOT_LIKE)
}

module.exports = isNotLike
