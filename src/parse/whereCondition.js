var error = require('../error')

var between = require('./between')

var isKeyword = require('../util/isKeyword')
var isSingleQuotedString = require('../util/isSingleQuotedString')
var isStringNumber = require('../util/isStringNumber')

var isComparisonOperator = require('../util/isComparisonOperator')
var isKeywordOrOperator = require('../util/isKeywordOrOperator')
var isLogicalOperator = require('../util/isLogicalOperator')
var isSetOperator = require('../util/isSetOperator')

var isSelect = isKeyword('SELECT')

var comparison = require('./comparison')

var isAnd = isLogicalOperator('AND')
var isOr = isLogicalOperator('OR')

var isBetween = isSetOperator('BETWEEN')
var isIn = isSetOperator('IN')

function whereCondition (tokens, startIndex, select, sql) {
  var json = []
  var numTokens = tokens.length

  var afterNextToken
  var currentToken
  var foundRightParenthesis = false
  var nextToken
  var token

  var andCondition = null
  var orCondition = null
  var currentCondition = null
  var comparisonExpression

  var leftOperand
  var rightOperand

  var j

  for (var i = startIndex; i < numTokens; i++) {
    token = tokens[i]
    nextToken = tokens[i + 1]
    afterNextToken = tokens[i + 2]
    var numOpenParenthesis

    // Iterate over sub conditions.

    if ((!isIn(token)) && (nextToken === '(')) {
      foundRightParenthesis = false
      numOpenParenthesis = 1
      var subConditionTokens = []

      if (isAnd(token)) {
        andCondition = {}
      }

      if (isOr(token)) {
        orCondition = {}
      }

      for (j = i + 2; j < numTokens; j++) {
        if (foundRightParenthesis) continue

        token = tokens[j]

        if (token === '(') numOpenParenthesis++
        if (token === ')') numOpenParenthesis--

        if (numOpenParenthesis === 0) {
          foundRightParenthesis = true
          i = j + 1
        } else {
          subConditionTokens.push(token)
        }
      }

      if (!foundRightParenthesis) throw error.invalidSQL(sql)

      var logicalExpression = whereCondition(subConditionTokens, 0, select, sql)
      if (andCondition) {
        andCondition.AND = logicalExpression
        json = json.concat(andCondition)
        andCondition = null
      } else if (orCondition) {
        orCondition.OR = logicalExpression
        json = json.concat(orCondition)
        orCondition = null
      } else {
        json = json.concat(logicalExpression)
      }
    }

    // Common condition can be OR, AND, IN, BETWEEN.

    if (isBetween(nextToken)) {
      try {
        comparisonExpression = between(token, tokens[i + 2], tokens[i + 3], tokens[i + 4])

        json = json.concat(comparisonExpression)
      } catch (err) { throw err }
    }

    if (isAnd(token)) {
      andCondition = {}
      andCondition.AND = []
    }

    if (isOr(token)) {
      orCondition = {}
      orCondition.OR = []
    }

    if (isComparisonOperator(nextToken)) {
      try {
        comparisonExpression = comparison(token, nextToken, afterNextToken)

        if (andCondition) {
          andCondition.AND = andCondition.AND.concat(comparisonExpression)
          json = json.concat(andCondition)
          andCondition = null
        } else if (orCondition) {
          orCondition.OR = orCondition.OR.concat(comparisonExpression)

          json = json.concat(orCondition)

          orCondition = null
        } else {
          json = json.concat(comparisonExpression)
        }

        i = i + 1
      } catch (err) { throw err }
    }

    if (isIn(token)) {
      leftOperand = tokens[i - 1]
      nextToken = tokens[i + 1]
      foundRightParenthesis = false

      if (nextToken !== '(') throw error.invalidSQL(sql)

      if (!afterNextToken) throw error.invalidSQL(sql)

      if (isSelect(afterNextToken)) {
        currentCondition = {}
        var subQueryTokens = []

        for (j = i + 2; j < numTokens; j++) {
          token = tokens[j]

          if (token === ')') {
            currentCondition.IN = select(subQueryTokens, sql)
            json.push(leftOperand, currentCondition)

            foundRightParenthesis = true
            i = j
          } else {
            subQueryTokens.push(token)
          }
        }

        if (foundRightParenthesis) {
          foundRightParenthesis = false
        } else {
          throw error.invalidSQL(sql)
        }
      } else {
        if (!currentCondition) currentCondition = {}
        rightOperand = []

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

        currentCondition[token] = rightOperand

        if (andCondition) {
          andCondition.AND.push(leftOperand, currentCondition)
          json.push(andCondition)
          andCondition = null
          currentCondition = null
          continue
        }

        if (orCondition) {
          orCondition.OR.push(leftOperand, currentCondition)
          json.push(orCondition)
          orCondition = null
          currentCondition = null
          continue
        }

        json.push(leftOperand, currentCondition)
        currentCondition = null
      }
    }
  }

  return json
}

module.exports = whereCondition
