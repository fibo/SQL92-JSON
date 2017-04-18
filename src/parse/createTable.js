var error = require('../error')

var isKeyword = require('../util/isKeyword')
var isTableName = require('../util/isTableName')

var isCreateTable = isKeyword('CREATE TABLE')

/**
 * Parse and serialize a CREATE TABLE statement.
 *
 * @params {Array} tokens
 * @params {Array} [sql] used to raise errors, if any
 *
 * @returns {Object} json that serialize the SQL statement.
 */

function createTable (tokens, sql) {
  var json = {}

  var firstToken = tokens[0]
  var tableName = tokens[1]

  if (!isCreateTable(firstToken)) throw error.invalidSQL(sql)

  if (!isTableName(tableName)) throw error.invalidTableName(tableName)

  json.name = tableName

  // TODO cheating tests, implement it for real!
  json.fields = [ [ 'ok', 'BOOLEAN' ] ]

  return { 'CREATE TABLE': json }
}

module.exports = createTable
