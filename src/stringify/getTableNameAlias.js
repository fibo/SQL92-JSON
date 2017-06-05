var isKeyword = require('../util/isKeyword')
var isTableName = require('../util/isTableName')

/**
 * Extract table name alias and check that table name is valid.
 *
 * { t: 'mytable' } => t
 *
 * @param {Object} statement
 *
 * @returns {String|undefined} alias
 */

function getTableNameAlias (statement) {
  var keys = Object.keys(statement)
  var tableName

  for (var i = 0; i < keys.length; i++) {
    var token = keys[i]

    if (isKeyword()(token)) continue

    tableName = statement[token]

    if (isTableName(tableName)) {
      return token
    } else {
      return
    }
  }
}

module.exports = getTableNameAlias
