var isCreateTable = require('./isCreateTable')
var isDropTable = require('./isDropTable')
var isSelect = require('./isSelect')

var createTable = require('./createTable')
var dropTable = require('./dropTable')
var select = require('./select')

/**
 * Convert JSON to SQL.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function stringify (json) {
  var sql = ''

  if (isDropTable(json)) {
    return dropTable(json)
  }

  if (isCreateTable(json, stringify)) {
    sql = createTable(json, stringify)
  }

  if (isSelect(json)) {
    // A SELECT statement could be a continuation of an INSERT,
    // or a CREATE TABLE foo AS, so it is necessary to add a
    // space separator in between.
    if (sql !== '') sql += ' '

    sql += select(json, sql)
  }

  return sql
}

module.exports = stringify
