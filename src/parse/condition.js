var error = require('../error')

var between = require('./between')
var like = require('./like')

var isKeyword = require('../util/isKeyword')
var isSingleQuotedString = require('../util/isSingleQuotedString')
var isStringNumber = require('../util/isStringNumber')

var isAnyJoin = require('../util/isAnyJoin')
var isComparisonOperator = require('../util/isComparisonOperator')
var isKeywordOrOperator = require('../util/isKeywordOrOperator')
var isLogicalOperator = require('../util/isLogicalOperator')
var isSetOperator = require('../util/isSetOperator')
var comparison = require('./comparison')
var removeFirstAndLastChar = require('../util/removeFirstAndLastChar')

var isSelect = isKeyword('SELECT')

var isAnd = isLogicalOperator('AND')
var isOr = isLogicalOperator('OR')

var isBetween = isSetOperator('BETWEEN')
var isLike = isSetOperator('LIKE')
var isNotBetween = isSetOperator('NOT BETWEEN')
var isNotLike = isSetOperator('NOT LIKE')
var isIn = isSetOperator('IN')

/**
 * Parse a filter condition, like a JOIN, WHERE or HAVING clause.
 *
 * @param {Array} tokens
 * @param {Number} startIndex
 * @param {String} sql
 *
 * @returns {Array} json
 */

function condition (tokens, startIndex, select, sql) {
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
  var not

  for (var i = startIndex; i < numTokens; i++) {
    token = tokens[i]
    nextToken = tokens[i + 1]
    afterNextToken = tokens[i + 2]
    var numOpenParenthesis

    // Stop if some join is found.
    if (isAnyJoin(token)) break

    if (isAnd(token)) andCondition = { AND: [] }
    if (isOr(token)) orCondition = { OR: [] }

    // Iterate over sub conditions.

    if ((!isIn(token)) && (nextToken === '(')) {
      foundRightParenthesis = false
      numOpenParenthesis = 1
      var subConditionTokens = []

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

      if (!foundRightParenthesis) throw error.unclosedParenthesisExpression(tokens)

      var logicalExpression = condition(subConditionTokens, 0, select, sql)

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

    // Common condition can be OR, AND, BETWEEN, NOT BETWEEN, LIKE, NOT LIKE.

    if (isBetween(nextToken) || isNotBetween(nextToken)) {
      try {
        if (isNotBetween(nextToken)) not = true

        comparisonExpression = between(token, tokens[i + 2], tokens[i + 3], tokens[i + 4], not)

        if (andCondition) {
          andCondition.AND = comparisonExpression
          json = json.concat(andCondition)
          andCondition = null
        } else if (orCondition) {
          orCondition.OR = comparisonExpression
          json = json.concat(orCondition)
          orCondition = null
        } else {
          json = json.concat(comparisonExpression)
        }

        i = i + 4
      } catch (err) { throw err }
    }

    if (isLike(nextToken) || isNotLike(nextToken)) {
      try {
        comparisonExpression = like(nextToken, afterNextToken)

        if (andCondition) {
          andCondition.AND = comparisonExpression
          json = json.concat(andCondition)
          andCondition = null
        } else if (orCondition) {
          orCondition.OR = comparisonExpression
          json = json.concat(orCondition)
          orCondition = null
        } else {
          json = json.concat(comparisonExpression)
        }

        i = i + 2
      } catch (err) { throw err }
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

    // TODO There is another isIn conditions in this file and both can be merged.
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
              rightOperand.push(removeFirstAndLastChar(currentToken))
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

module.exports = condition
