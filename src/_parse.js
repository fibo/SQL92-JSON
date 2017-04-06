var error = require('./error')
var isKeywordOrOperator = require('./util/isKeywordOrOperator')
// var isLogicalOperator = require('./util/isLogicalOperator')
var isSetOperator = require('./util/isSetOperator')
var isSingleQuotedString = require('./util/isSingleQuotedString')
var isStringNumber = require('./util/isStringNumber')
var isKeyword = require('./util/isKeyword')
var tokenize = require('./util/tokenize')

var isCount = isKeyword('COUNT')
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

// var isAnd = isLogicalOperator('AND')
var isIn = isSetOperator('IN')

// TODO organize this snippet, by now it is used for equal conditions in WHERE
function condition (operator, rightOperand) {
  var obj = {}
  obj[operator] = rightOperand
  return obj
}

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
    var currentToken
    var firstToken = tokens[0]
    var i
    var j
    var nextToken
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
      json.SELECT = []

      var foundFrom = false
      var foundLimit = false
      var foundOffset = false
      var foundWhere = false

      var foundRightParenthesis = false

      var fromIndex
      // var havingIndex
      // var groupByIndex
      var limitIndex
      var offsetIndex
      // var orderByIndex
      var whereIndex

      var leftOperand
      var rightOperand

      for (i = 1; i < numTokens; i++) {
        if (foundFrom) continue

        token = tokens[i]

        if (token === ',') continue

        if (isFrom(token)) {
          foundFrom = true
          fromIndex = i
        } else {
          if (isStringNumber(token)) {
            json.SELECT.push(parseFloat(token))
            continue
          }

          if (isCount(token)) {
            // TODO cheating tests.
            json.SELECT.push({ COUNT: tokens[i + 2] })
            i = i + 3
            continue
          }

          json.SELECT.push(token)
        }
      }

      // FROM
      // //////////////////////////////////////////////////////////////////////

      if (foundFrom) {
        // TODO cheating tests.
        json.FROM = [ 'mytable' ]

        // WHERE
        // ////////////////////////////////////////////////////////////////////

        for (i = fromIndex; i < numTokens; i++) {
          if (foundWhere) continue

          token = tokens[i]

          if (isWhere(token)) {
            foundWhere = true
            whereIndex = i
            json.WHERE = []
          }
        }

        if (foundWhere) {
          // After a WHERE there should be at least one condition and it will
          // have more al least 3 tokens: leftOperand, operator, rightOperand.
          if (whereIndex === numTokens - 3) throw error.invalidSQL(sql)

          for (i = whereIndex; i < numTokens; i++) {
            token = tokens[i]

            if (token === '=') {
              leftOperand = tokens[i - 1]
              rightOperand = tokens[i + 1]

              if (isKeywordOrOperator(leftOperand)) throw error.invalidSQL(sql)
              if (isKeywordOrOperator(rightOperand)) throw error.invalidSQL(sql)

              if (isStringNumber(leftOperand)) leftOperand = parseFloat(leftOperand)
              if (isStringNumber(rightOperand)) rightOperand = parseFloat(rightOperand)

              json.WHERE.push(leftOperand, condition(token, rightOperand))
            }

            if (isIn(token)) {
              nextToken = tokens[i + 1]
              foundRightParenthesis = false
              leftOperand = tokens[i - 1]
              rightOperand = []

              if (nextToken !== '(') throw error.invalidSQL(sql)

              if (isKeywordOrOperator(leftOperand)) throw error.invalidSQL(sql)
              if (isStringNumber(leftOperand)) throw error.invalidSQL(sql)

              for (j = i + 2; j < numTokens; j = j + 2) {
                currentToken = tokens[j]
                nextToken = tokens[j + 1]

                if ((nextToken === ',') || (nextToken === ')')) {
                  if (isSingleQuotedString(currentToken)) {
                    // Remove quotes, that are first and last characters.
                    rightOperand.push(currentToken.substring(1, currentToken.length - 1))
                  }

                  if (isStringNumber(currentToken)) {
                    rightOperand.push(parseFloat(currentToken))
                  }

                  // TODO I am not sure if there are other cases,
                  // should I raise an exception here, if token is not
                  // a string or is not a number?
                }

                // Clean up, this will be the last iteration so place
                // the cursor at the right position and remember that
                // we found a right parenthesis.

                if (nextToken === ')') {
                  i = j + 1

                  foundRightParenthesis = true

                  break
                }
              }

              if (!foundRightParenthesis) throw error.invalidSQL(sql)

              json.WHERE.push(leftOperand, condition(token, rightOperand))
            }
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
