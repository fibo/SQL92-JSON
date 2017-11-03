var error = require('../error')

var condition = require('./condition')
var select = require('./select')

var isKeyword = require('../util/isKeyword')
var isTableName = require('../util/isTableName')

var isDeleteFrom = isKeyword('DELETE FROM')

/**
 * Parse and serialize a DELETE FROM statement.
 *
 * @params {Array} tokens
 * @params {Array} [sql] used to raise errors, if any
 *
 * @returns {Object} json that serialize the SQL statement.
 */

function deleteFrom (tokens, sql) {
  var firstToken = tokens[0]
  var tableName = tokens[1]
  var json = {}

  if (!isDeleteFrom(firstToken)) throw error.invalidSQL(sql)

  if (!isTableName(tableName)) throw error.invalidTableName(tableName)

  json['DELETE FROM'] = tableName

  if (tokens.length > 2) {
    json.WHERE = condition(tokens.splice(0), 2, select, sql)
  }

  return json
}

module.exports = deleteFrom
