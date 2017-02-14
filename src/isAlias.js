/**
 * Check that expression is an alias field.
 *
 * { SELECT: ['*'] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isAlias (json) {
  return typeof json.AS !== 'undefined'
}

module.exports = isAlias
