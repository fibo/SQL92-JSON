var error = require('../error')

var isKeyword = require('../util/isKeyword')
var isStringNumber = require('../util/isStringNumber')
var isTableName = require('../util/isTableName')

var isAs = isKeyword('AS')
var isCount = isKeyword('COUNT')
var isDistinct = isKeyword('DISTINCT')
var isFrom = isKeyword('FROM')
var isGroupBy = isKeyword('GROUP BY')
var isHaving = isKeyword('HAVING')
var isLimit = isKeyword('LIMIT')
var isOffset = isKeyword('OFFSET')
var isOrderBy = isKeyword('ORDER BY')
var isSelect = isKeyword('SELECT')
var isUnion = isKeyword('UNION')
var isWhere = isKeyword('WHERE')

var whereCondition = require('./whereCondition')

/**
 * Parse and serialize a SELECT statement.
 *
 * @params {Array} tokens
 * @params {Array} [sql] used to raise errors, if any
 *
 * @returns {Object} json that serialize the SQL statement.
 */

function select (tokens, sql) {
  var json = { SELECT: [] }

  var countExpression

  var currentToken
  var firstToken = tokens[0]
  var foundRightParenthesis = false
  var nextToken
  var numTokens = tokens.length
  var subQueryTokens
  var token

  var i
  var j

  var foundFrom = false
  var foundLimit = false
  var foundGroupBy = false
  var foundHaving = false
  var foundOffset = false
  var foundOrderBy = false
  var foundUnion = false
  var foundWhere = false

  var fromIndex
  var havingIndex
  var groupByIndex
  var limitIndex
  var offsetIndex
  var orderByIndex
  var unionIndex
  var whereIndex

  if (!isSelect(firstToken)) throw error.invalidSQL(sql)

  // SELECT
  // ////////////////////////////////////////////////////////////////////////

  for (i = 1; i < numTokens; i++) {
    if (foundFrom) continue

    token = tokens[i]

    if (token === ',') continue

    if (isDistinct(token)) {
      json.DISTINCT = true
      continue
    }

    if (isFrom(token)) {
      foundFrom = true
      fromIndex = i
    } else {
      if (isStringNumber(token)) {
        json.SELECT.push(parseFloat(token))
        continue
      }

      if (isCount(token)) {
        foundRightParenthesis = false
        countExpression = {}

        nextToken = tokens[i + 1]
        if (nextToken !== '(') throw error.invalidSQL(sql)

        for (j = i + 1; j < numTokens; j++) {
          currentToken = tokens[j]
          nextToken = tokens[j + 1]

          if (currentToken === ')') {
            foundRightParenthesis = true

            if (isAs(nextToken)) {
              countExpression.AS = tokens[j + 2]
              i = j + 2
            } else {
              i = j
            }

            break
          }

          // TODO complex count expressions
          if (isStringNumber(currentToken)) {
            countExpression.COUNT = parseFloat(currentToken)
          } else {
            countExpression.COUNT = currentToken
          }
        }

        if (!foundRightParenthesis) throw error.invalidSQL(sql)

        json.SELECT.push(countExpression)

        continue
      }

      json.SELECT.push(token)
    }
  }

  // FROM
  // //////////////////////////////////////////////////////////////////////

  if (foundFrom) {
    json.FROM = []

    for (i = fromIndex + 1; i < numTokens; i++) {
      token = tokens[i]

      if (isWhere(token)) {
        foundWhere = true
        whereIndex = i
      }

      if (isGroupBy(token)) {
        foundGroupBy = true
        groupByIndex = i
      }

      if (isHaving(token)) {
        foundHaving = true
        havingIndex = i
      }

      if (isOrderBy(token)) {
        foundOrderBy = true
        orderByIndex = i
      }

      if (isUnion(token)) {
        foundUnion = true
        unionIndex = i
        break
      }

      if (foundWhere || foundGroupBy || foundHaving || foundOrderBy) continue

      if (token === ',') continue

      if (token === '(') {
        // A sub query must start with a SELECT.
        firstToken = tokens[i + 1]
        if (!isSelect(firstToken)) throw error.invalidSQL(sql)

        foundRightParenthesis = false
        subQueryTokens = []

        for (j = i + 1; j < numTokens; j++) {
          token = tokens[j]

          if (token === ')') {
            foundRightParenthesis = true
            i = j
            json.FROM.push(select(subQueryTokens, sql))
          } else {
            subQueryTokens.push(token)
          }
        }

        if (foundRightParenthesis) {
          foundRightParenthesis = false
        } else {
          throw error.invalidSQL(sql)
        }
      }

      if (isTableName(token)) {
        json.FROM.push(token)
      }
    }

    // WHERE
    // ////////////////////////////////////////////////////////////////////

    if (foundWhere) {
      // After a WHERE there should be at least one condition and it will
      // have more al least 3 tokens: leftOperand, operator, rightOperand.
      if (whereIndex === numTokens - 3) throw error.invalidSQL(sql)

      json.WHERE = whereCondition(tokens, whereIndex, select, sql)
    }

    // GROUP BY
    // ////////////////////////////////////////////////////////////////////

    if (foundGroupBy) {
      json['GROUP BY'] = []

      for (i = groupByIndex + 1; i < numTokens; i++) {
        token = tokens[i]

        if (token === ',') continue

        // TODO probably this logic is incomplete
        if (isKeyword()(token)) break

        if (isStringNumber(token)) {
          token = parseFloat(token)
        }

        json['GROUP BY'].push(token)
      }
    }

    // HAVING
    // ////////////////////////////////////////////////////////////////////

    if (foundHaving) {
      // After a HAVING there should be at least one condition and it will
      // have more al least 3 tokens: leftOperand, operator, rightOperand.
      if (havingIndex === numTokens - 3) throw error.invalidSQL(sql)

      json.HAVING = whereCondition(tokens, havingIndex, select, sql)
    }

    // ORDER BY
    // ////////////////////////////////////////////////////////////////////

    if (foundOrderBy) {
      json['ORDER BY'] = []

      for (i = orderByIndex + 1; i < numTokens; i++) {
        token = tokens[i]

        if (token === ',') continue

        // TODO probably this logic is incomplete
        if (isKeyword()(token)) break

        if (isStringNumber(token)) {
          token = parseFloat(token)
        }

        json['ORDER BY'].push(token)
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

    // UNION
    // ////////////////////////////////////////////////////////////////////

    if (foundUnion) {
      json.UNION = select(tokens.splice(unionIndex + 1), sql)
    }
  }

  return json
}

module.exports = select
