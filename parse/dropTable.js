var error = require('../error')

var isKeyword = require('../util/isKeyword')
var isTableName = require('../util/isTableName')

var isDropTable = isKeyword('DROP TABLE')

/**
 * Parse and serialize a DROP TABLE statement.
 *
 * @params {Array} tokens
 * @params {Array} [sql] used to raise errors, if any
 *
 * @returns {Object} json that serialize the SQL statement.
 */

function dropTable (tokens, sql) {
  var firstToken = tokens[0]
  var tableName = tokens[1]

  if (!isDropTable(firstToken)) throw error.invalidSQL(sql)

  if (!isTableName(tableName)) throw error.invalidTableName(tableName)

  return { 'DROP TABLE': tableName }
}

module.exports = dropTable
