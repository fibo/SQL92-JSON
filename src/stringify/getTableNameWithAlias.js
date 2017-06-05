var getTableNameAlias = require('./getTableNameAlias')
var isKeyword = require('../util/isKeyword')
var isAs = isKeyword('AS')

/**
 * Extract table name with alias.
 *
 * { t: 'mytable', JOIN: {} } => { t: 'mytable' }
 * { AS: { t: 'mytable' }, JOIN: {} } => { AS: { t: 'mytable' } }
 *
 * @param {Object} statement
 *
 * @returns {Object|undefined}
 */

function getTableNameWithAlias (statement) {
  var keys = Object.keys(statement)
  var tableObj
  var tableName

  var alias = getTableNameAlias(statement)

  if (alias) {
    tableObj = {}
    tableName = statement[alias]
    tableObj[alias] = tableName
  } else {
    for (var i = 0; i < keys.length; i++) {
      var token = keys[i]

      if (isAs(token)) {
        alias = getTableNameAlias(statement[token])

        if (alias) {
          tableObj = { AS: statement[token] }
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
