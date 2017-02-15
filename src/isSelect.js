/**
 * Check that expression is a SELECT.
 *
 * { SELECT: [1] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isSelect (json) {
  var SELECT = json.SELECT

  return Array.isArray(SELECT) && SELECT.length > 0
}

module.exports = isSelect
