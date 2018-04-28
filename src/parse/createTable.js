var error = require('../error')

var isKeyword = require('../util/isKeyword')
var isTableName = require('../util/isTableName')
var select = require('./select')

var isAs = isKeyword('AS')
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

  if (isAs(tokens[2])) {
    json.AS = select(tokens.slice(3))
  } else {
    json.fields = []

    for (var i = 2; i < tokens.length; i++) {
      var token = tokens[i]
      var nextToken = tokens[i + 1]

      if (token === '(') continue
      if (token === ',') continue
      if (token === ')') continue

      json.fields.push([token, nextToken])
      i++
    }
  }

  return { 'CREATE TABLE': json }
}

module.exports = createTable
