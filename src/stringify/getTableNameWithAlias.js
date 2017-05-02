var isKeyword = require('../util/isKeyword')

/**
 * Extract tablename with alias.
 *
 * { t: 'mytable', JOIN: {} } => { t: 'mytable' }
 *
 * @param {Object} json
 *
 * @returns {Object}
 */

function getTableNameWithAlias (statement) {
  var keys = Object.keys(statement)

  var alias = null

  for (var i = 0; i < keys.length; i++) {
    var token = keys[i]

    if (isKeyword(token)) continue

    alias = token
    break
  }

  return alias
}

module.exports = getTableNameWithAlias
