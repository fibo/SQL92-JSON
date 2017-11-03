var getTableNameAlias = require('./getTableNameAlias')
var isKeyword = require('../util/isKeyword')
var isAs = isKeyword('AS')

/**
 * Extract table name with alias.
 *
 * { t: 'mytable', JOIN: {} } => { t: 'mytable' }
 * { AS: { t: 'mytable' }, JOIN: {} } => { AS: { t: 'mytable' } }
 *
 * @param {Object} json
 *
 * @returns {Object|undefined}
 */

function getTableNameWithAlias (json) {
  var keys = Object.keys(json)
  var tableObj
  var tableName

  var alias = getTableNameAlias(json)

  if (alias) {
    tableObj = {}
    tableName = json[alias]
    tableObj[alias] = tableName
  } else {
    for (var i = 0; i < keys.length; i++) {
      var token = keys[i]

      if (isAs(token)) {
        alias = getTableNameAlias(json[token])

        if (alias) {
          tableObj = { AS: json[token] }
          break
        } else {
          return
        }
      }
    }
  }

  return tableObj
}

module.exports = getTableNameWithAlias
