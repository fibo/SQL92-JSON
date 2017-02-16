var isString = require('./util/isString')

/**
 * Check that expression is an alias field.
 *
 * { AS: "myalias" } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isAlias (json) {
  return isString(json.AS)
}

module.exports = isAlias
