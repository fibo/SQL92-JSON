var error = require('../error')

var isKeyword = require('../util/isKeyword')
var tokenize = require('../util/tokenize')

var createTable = require('./createTable')
var select = require('./select')

var isCreateTable = isKeyword('CREATE TABLE')
var isDelete = isKeyword('DELETE')
var isDrop = isKeyword('DROP')
var isInsert = isKeyword('INSERT')
var isSelect = isKeyword('SELECT')
var isTruncate = isKeyword('TRUNCATE')
var isUpdate = isKeyword('UPDATE')

/**
 * Convert SQL to JSON.
 *
 * @param {String} sql
 *
 * @returns {Object} json
 */

function parse (sql) {
  var json
  var tokens = tokenize(sql)

  var firstToken = tokens[0]

  function serialize (json, tokens) {
    var firstTokenIsValid = (
      isCreateTable(firstToken) ||
      isDelete(firstToken) ||
      isDrop(firstToken) ||
      isInsert(firstToken) ||
      isSelect(firstToken) ||
      isTruncate(firstToken) ||
      isUpdate(firstToken)
    )

    if (!firstTokenIsValid) throw error.invalidSQL(sql)

    if (isCreateTable(firstToken)) return createTable(tokens, sql)
    if (isSelect(firstToken)) return select(tokens, sql)
  }

  if (tokens.indexOf(';') === -1) {
    json = {}

    return serialize(json, tokens)
  } else {
    json = []

    // TODO consider ';' as a sql statements separator
    // loop over tokens and create an array of queries
    return json
  }
}

module.exports = parse
