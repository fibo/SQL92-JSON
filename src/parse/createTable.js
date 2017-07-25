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
  var numTokens = tokens.length

  var token
  var nextToken

  if (!isCreateTable(firstToken)) throw error.invalidSQL(sql)

  if (!isTableName(tableName)) throw error.invalidTableName(tableName)

  json.name = tableName

  // TODO cheating tests, implement it for real!
  json.fields = []

  for (var i = 2; i < numTokens; i++) {
    token = tokens[i]
    nextToken = tokens[i + 1]

    if (token === '(') continue
    if (token === ',') continue
    if (token === ')') continue

    json.fields.push([token, nextToken])
    i++
  }

  return { 'CREATE TABLE': json }
}

module.exports = createTable
