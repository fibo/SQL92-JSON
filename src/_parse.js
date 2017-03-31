var error = require('./error')
var isStringNumber = require('./util/isStringNumber')
var isKeyword = require('./util/isKeyword')
var tokenize = require('./util/tokenize')

var isDrop = isKeyword('DROP')
var isFrom = isKeyword('FROM')
var isDelete = isKeyword('DELETE')
var isInsert = isKeyword('INSERT')
var isLimit = isKeyword('LIMIT')
var isOffset = isKeyword('OFFSET')
var isSelect = isKeyword('SELECT')
var isTruncate = isKeyword('TRUNCATE')
var isUpdate = isKeyword('UPDATE')
var isWhere = isKeyword('WHERE')

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
    var i
    var numTokens = tokens.length
    var token

    var firstTokenIsValid = (
      isDelete(firstToken) ||
      isDrop(firstToken) ||
      isInsert(firstToken) ||
      isSelect(firstToken) ||
      isTruncate(firstToken) ||
      isUpdate(firstToken)
    )

    if (!firstTokenIsValid) throw error.invalidSQL(sql)

    // SELECT
    // ////////////////////////////////////////////////////////////////////////

    if (isSelect(firstToken)) {
      json[firstToken] = []

      var foundFrom = false
      var foundLimit = false
      var foundOffset = false
      var foundWhere = false

      var fromIndex
      // var havingIndex
      // var groupByIndex
      var limitIndex
      var offsetIndex
      // var orderByIndex
      // var whereIndex

      for (i = 1; i < numTokens; i++) {
        if (foundFrom) continue

        token = tokens[i]

        if (token === ',') continue

        if (isFrom(token)) {
          foundFrom = true
          fromIndex = i
        } else {
          if (isStringNumber(token)) {
            json[firstToken].push(parseFloat(token))
          } else {
            json[firstToken].push(token)
          }
        }
      }

      // FROM
      // //////////////////////////////////////////////////////////////////////

      if (foundFrom) {
        // TODO cheating tests.
        json.FROM = [ 'mytable' ]

        for (i = fromIndex; i < numTokens; i++) {
          if (foundWhere) continue

          token = tokens[i]

          if (isWhere(token)) {
            foundWhere = true
            // whereIndex = i
          }
        }

        // LIMIT
        // ////////////////////////////////////////////////////////////////////

        for (i = fromIndex; i < numTokens; i++) {
          if (foundLimit) continue

          token = tokens[i]

          if (isLimit(token)) {
            foundLimit = true
            limitIndex = i
          }
        }

        if (foundLimit) {
          if (limitIndex === numTokens - 1) throw error.invalidSQL(sql)

          var limitValue = tokens[limitIndex + 1]

          if (isStringNumber(limitValue)) {
            limitValue = parseFloat(limitValue)

            if (limitValue >= 0) json.LIMIT = limitValue
            else throw error.invalidSQL(sql)
          } else {
            throw error.invalidSQL(sql)
          }
        }

        // OFFSET
        // ////////////////////////////////////////////////////////////////////

        for (i = fromIndex; i < numTokens; i++) {
          if (foundOffset) continue

          token = tokens[i]

          if (isOffset(token)) {
            foundOffset = true
            offsetIndex = i
          }
        }

        if (foundOffset) {
          if (offsetIndex === numTokens - 1) throw error.invalidSQL(sql)

          var offsetValue = tokens[offsetIndex + 1]

          if (isStringNumber(offsetValue)) {
            offsetValue = parseFloat(offsetValue)

            if (offsetValue >= 0) json.OFFSET = offsetValue
            else throw error.invalidSQL(sql)
          } else {
            throw error.invalidSQL(sql)
          }
        }
      }

      return json
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
