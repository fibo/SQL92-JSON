var isTableName = require('../util/isTableName')

/**
 * Check that expression is a DELETE FROM.
 *
 * {
 *   'DELETE FROM': 'mytable'
 * } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isDeleteFrom (json) {
  var tableName = json['DELETE FROM']

  if (!tableName) return false

  return isTableName(tableName)
  // TODO check WHERE condition
}

module.exports = isDeleteFrom
