var isTableName = require('../util/isTableName')

/**
 * Check that expression is a DROP TABLE.
 *
 * {
 *   'DROP TABLE': 'mytable'
 * } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isDropTable (json) {
  var tableName = json['DROP TABLE']

  if (!tableName) return false

  return isTableName(tableName)
}

module.exports = isDropTable
