/**
 * Check that expression is a SELECT.
 *
 * { SELECT: ['*'] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isSelect (json) {
  return Array.isArray(json.SELECT) && json.SELECT.length > 0
}

module.exports = isSelect
