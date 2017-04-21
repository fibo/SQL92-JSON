var error = require('../error')

var isKeyword = require('../util/isKeyword')
var isMathOperator = require('../util/isMathOperator')
var isDoubleQuotedString = require('../util/isDoubleQuotedString')
var isStar = require('../util/isStar')
var isString = require('../util/isString')
var isStringNumber = require('../util/isStringNumber')
var isStringOperator = require('../util/isStringOperator')
var isTableName = require('../util/isTableName')
var removeFirstAndLastChar = require('../util/removeFirstAndLastChar')

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

  var afterNextToken
  var firstToken = tokens[0]
  var foundRightParenthesis = false
  var nextToken
  var numOpenParenthesis
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
    token = tokens[i]
    nextToken = tokens[i + 1]
    afterNextToken = tokens[i + 2]

    if (isFrom(token)) {
      foundFrom = true
      fromIndex = i
      break
    }

    if (isUnion(token)) {
      foundUnion = true
      unionIndex = i
      break
    }

    if (token === ',') continue

    if (isDistinct(token)) {
      json.DISTINCT = true
      continue
    }

    // Math expressions.

    if (isMathOperator(nextToken)) {
      // TODO for loop to get more complex math expressions
      json.SELECT.push([parseFloat(token), nextToken, parseFloat(afterNextToken)])
      i = i + 2
      continue
    }

    if (isStringNumber(token)) {
      json.SELECT.push(parseFloat(token))

      continue
    }

    if (isCount(token)) {
      foundRightParenthesis = false
      countExpression = {}

      if (nextToken !== '(') throw error.invalidSQL(sql)

      for (j = i + 1; j < numTokens; j++) {
        token = tokens[j]
        nextToken = tokens[j + 1]
        afterNextToken = tokens[j + 2]

        if (token === ')') {
          foundRightParenthesis = true

          if (isAs(nextToken)) {
            if (isDoubleQuotedString(afterNextToken)) {
              afterNextToken = removeFirstAndLastChar(afterNextToken)
            }

            countExpression.AS = afterNextToken
            i = j + 2
          } else {
            i = j
          }

          break
        }

        // TODO complex count expressions
        if (isStringNumber(token)) {
          countExpression.COUNT = parseFloat(token)
        } else {
          countExpression.COUNT = token
        }
      }

      if (!foundRightParenthesis) throw error.invalidSQL(sql)

      json.SELECT.push(countExpression)

      continue
    }

    // String concatenation.

    if (isString(token)) {
      if (isStringOperator(nextToken)) {
        // TODO for loop to get larger string concatenations.
        json.SELECT.push([token, nextToken, afterNextToken])
        i = i + 2
      } else {
        json.SELECT.push(token)
      }

      continue
    }

    if (isStar(token)) json.SELECT.push(token)
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
        firstToken = tokens[i + 1]
        foundRightParenthesis = false
        numOpenParenthesis = 1

        // A sub query must start with a SELECT.
        if (!isSelect(firstToken)) throw error.invalidSQL(sql)

        subQueryTokens = []

        for (j = i + 1; j < numTokens; j++) {
          if (foundRightParenthesis) continue

          token = tokens[j]

          if (token === '(') numOpenParenthesis++
          if (token === ')') numOpenParenthesis--

          if (numOpenParenthesis === 0) {
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
  }

  // UNION
  // ////////////////////////////////////////////////////////////////////

  if (foundUnion) {
    json.UNION = select(tokens.splice(unionIndex + 1), sql)
  }

  return json
}

module.exports = select
