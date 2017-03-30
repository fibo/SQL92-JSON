var error = require('./error')
var isStringNumber = require('./util/isStringNumber')
var isKeyword = require('./util/isKeyword')
var tokenize = require('./util/tokenize')

var isDrop = isKeyword('DROP')
var isFrom = isKeyword('FROM')
var isDelete = isKeyword('DELETE')
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

  function serialize (json, tokens) {
    var firstToken = tokens[0]
    var numTokens = tokens.length

    var firstTokenIsValid = (
      isDelete(firstToken) ||
      isDrop(firstToken) ||
      isInsert(firstToken) ||
      isSelect(firstToken) ||
      isTruncate(firstToken) ||
      isUpdate(firstToken)
    )

    if (!firstTokenIsValid) throw error.invalidSQL(sql)

    if (isSelect(firstToken)) {
      json[firstToken] = []

      // Look for next FROM keyword.
      var foundFrom = false
      // var fromIndex

      for (var i = 1; i < numTokens; i++) {
        if (foundFrom) continue

        var token = tokens[i]

        if (isFrom(token)) {
          foundFrom = true
          // fromIndex = i
        } else {
          if (isStringNumber(token)) {
            json[firstToken].push(parseFloat(token))
          } else {
            json[firstToken].push(token)
          }
        }
      }

      if (foundFrom) {
        // for (var j = fromIndex; j < numTokens; i++) {
          // TODO
        // }
      } else {
        return json
      }
    }
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
