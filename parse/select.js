var error = require('../error')

var countTokens = require('../util/countTokens')
var isAnyJoin = require('../util/isAnyJoin')
var isDoubleQuotedString = require('../util/isDoubleQuotedString')
var isKeyword = require('../util/isKeyword')
var isMathOperator = require('../util/isMathOperator')
var isSetOperator = require('../util/isSetOperator')
var isStar = require('../util/isStar')
var isString = require('../util/isString')
var isStringNumber = require('../util/isStringNumber')
var isStringOperator = require('../util/isStringOperator')
var isTableName = require('../util/isTableName')
var removeFirstAndLastChar = require('../util/removeFirstAndLastChar')
var tokensEnclosedByParenthesis = require('../util/tokensEnclosedByParenthesis')

var isAs = isKeyword('AS')
var isAsc = isKeyword('ASC')
var isAvg = isKeyword('AVG')
var isCount = isKeyword('COUNT')
var isDesc = isKeyword('DESC')
var isDistinct = isKeyword('DISTINCT')
var isFrom = isKeyword('FROM')
var isGroupBy = isKeyword('GROUP BY')
var isHaving = isKeyword('HAVING')
var isLimit = isKeyword('LIMIT')
var isLower = isKeyword('LOWER')
var isMax = isKeyword('MAX')
var isMin = isKeyword('MIN')
var isNvl = isKeyword('NVL')
var isOffset = isKeyword('OFFSET')
var isOrderBy = isKeyword('ORDER BY')
var isSelect = isKeyword('SELECT')
var isSum = isKeyword('SUM')
var isUpper = isKeyword('UPPER')
var isWhere = isKeyword('WHERE')

var condition = require('./condition')
var join = require('./join')

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

  var aliasExpression
  var avgExpression
  var countExpression
  var joinKeyword
  var lowerExpression
  var maxExpression
  var minExpression
  var nvlExpression
  var subQueryExpression
  var sumExpression
  var upperExpression

  var table
  var setOperator

  var afterNextToken
  var firstToken = tokens[0]
  var nextToken
  var nextTokenIsNotKeyword
  var nextTokenIsAlias
  var numTokens = tokens.length
  var subQueryTokens
  var token

  var i

  var foundFrom = false
  var foundLimit = false
  var foundGroupBy = false
  var foundHaving = false
  var foundOffset = false
  var foundOrderBy = false
  var foundSetOperator = false
  var foundWhere = false

  var fromIndex
  var groupByIndex
  var havingIndex
  var limitIndex
  var offsetIndex
  var orderByIndex
  var setOperatorIndex
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

    // A query could use a set operator without a FROM clause, for example
    //
    // SELECT 1
    // UNION
    // SELECT num FROM mytable

    if (isSetOperator(token)) {
      foundSetOperator = true
      setOperator = token
      setOperatorIndex = i
      break
    }

    if (token === ',') continue

    if (isDistinct(token)) {
      json.DISTINCT = true
      continue
    }

    // Check for aliases first, since it is found looking at next token.

    if (isAs(nextToken)) {
      aliasExpression = { AS: {} }

      if (!isString(afterNextToken)) throw error.invalidSQL(sql)

      if (isDoubleQuotedString(afterNextToken)) {
        afterNextToken = removeFirstAndLastChar(afterNextToken)
      }

      // TODO a math expression could have an alias?
      // SELECT 1 + 2 AS sum

      if (isStringNumber(token)) token = parseFloat(token)

      aliasExpression.AS[afterNextToken] = token

      json.SELECT.push(aliasExpression)

      i += 2

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

    if (isAvg(token)) {
      avgExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          avgExpression.AVG = parseFloat(token)
        } else {
          avgExpression.AVG = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        avgExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(avgExpression)

      continue
    }

    if (isCount(token)) {
      countExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isDistinct(token)) {
          countExpression.DISTINCT = true
          return
        }

        if (isStringNumber(token)) {
          countExpression.COUNT = parseFloat(token)
        } else {
          countExpression.COUNT = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        countExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(countExpression)

      continue
    }

    if (isLower(token)) {
      lowerExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          lowerExpression.LOWER = parseFloat(token)
        } else {
          lowerExpression.LOWER = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        lowerExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(lowerExpression)

      continue
    }

    if (isMax(token)) {
      maxExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          maxExpression.MAX = parseFloat(token)
        } else {
          maxExpression.MAX = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        maxExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(maxExpression)

      continue
    }

    if (isMin(token)) {
      minExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          minExpression.MIN = parseFloat(token)
        } else {
          minExpression.MIN = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        minExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(minExpression)

      continue
    }

    if (isNvl(token)) {
      nvlExpression = { NVL: [] }

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          nvlExpression.NVL.push(parseFloat(token))
        } else {
          nvlExpression.NVL.push(token)
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        nvlExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(nvlExpression)

      continue
    }

    if (isSum(token)) {
      sumExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          sumExpression.SUM = parseFloat(token)
        } else {
          sumExpression.SUM = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        sumExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(sumExpression)

      continue
    }

    if (isUpper(token)) {
      upperExpression = {}

      tokensEnclosedByParenthesis(tokens, i + 1).forEach(function (token) {
        i++

        if (['(', ',', ')'].indexOf(token) > -1) return

        if (isStringNumber(token)) {
          upperExpression.UPPER = parseFloat(token)
        } else {
          upperExpression.UPPER = token
        }
      })

      nextToken = tokens[i + 1]
      afterNextToken = tokens[i + 2]

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        upperExpression.AS = afterNextToken
        i = i + 2
      }

      json.SELECT.push(upperExpression)

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

    // After looking for functions and other keywords, check if it is
    // an expression enclosed by parenthesis, it could be a sub query.

    if ((token === '(') && (isSelect(nextToken))) {
      subQueryExpression = {}
      subQueryTokens = tokensEnclosedByParenthesis(tokens, i)

      i = i + subQueryTokens.length

      nextToken = tokens[i]
      afterNextToken = tokens[i + 1]

      // Remove left and right parenthesis
      subQueryTokens.shift()
      subQueryTokens.pop()

      if (isAs(nextToken)) {
        if (isDoubleQuotedString(afterNextToken)) {
          afterNextToken = removeFirstAndLastChar(afterNextToken)
        }

        subQueryExpression.AS = {}
        subQueryExpression.AS[afterNextToken] = select(subQueryTokens, sql)

        json.SELECT.push(subQueryExpression)

        i = i + 1
      } else {
        json.SELECT.push(select(subQueryTokens, sql))
      }
    }
  }

  // FROM
  // //////////////////////////////////////////////////////////////////////

  if (foundFrom) {
    json.FROM = []

    for (i = fromIndex + 1; i < numTokens; i++) {
      token = tokens[i]

      if (i < numTokens - 1) {
        nextToken = tokens[i + 1]
      } else {
        nextToken = null
      }

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

      if (isSetOperator(token)) {
        foundSetOperator = true
        setOperator = token
        setOperatorIndex = i
        break
      }

      if (foundWhere || foundGroupBy || foundHaving || foundOrderBy) continue

      if (token === ',') continue

      if (token === '(') {
        subQueryExpression = {}
        subQueryTokens = tokensEnclosedByParenthesis(tokens, i)

        // Remove left and right parenthesis
        subQueryTokens.shift()
        subQueryTokens.pop()

        i = i + subQueryTokens.length + 1

        nextToken = tokens[i + 1]
        afterNextToken = tokens[i + 2]

        nextTokenIsNotKeyword = (!isKeyword()(nextToken))
        nextTokenIsAlias = (isString(nextToken) && nextTokenIsNotKeyword)

        if (isSelect(subQueryTokens[0])) {
          if (nextTokenIsAlias) {
            if (isAnyJoin(afterNextToken)) {
              // TODO implement JOIN as below
              // test the following commented code.
              // joinKeyword = afterNextToken

              // subQueryExpression[joinKeyword] = join(tokens, i + 3, select, sql)

              // json.FROM.push(subQueryExpression)

              // i += countTokens(subQueryExpression[joinKeyword]) + 2

              // continue
            } else {
              subQueryExpression[nextToken] = select(subQueryTokens, sql)

              json.FROM.push(subQueryExpression)

              i = i + 2

              continue
            }
          } else {
            json.FROM.push(select(subQueryTokens, sql))

            continue
          }
        } else {
          // A sub query must start with a SELECT.
          throw error.invalidSQL(sql)
        }
      }

      if (isTableName(token)) {
        table = token
        nextToken = tokens[i + 1]
        afterNextToken = tokens[i + 2]

        nextTokenIsNotKeyword = (!isKeyword()(nextToken))
        nextTokenIsAlias = (isString(nextToken) && nextTokenIsNotKeyword)

        if (nextTokenIsAlias) {
          table = {}
          table[nextToken] = token

          if (isAnyJoin(afterNextToken)) {
            joinKeyword = afterNextToken

            table[joinKeyword] = join(tokens, i + 3, select, sql)

            json.FROM.push(table)

            i += countTokens(table[joinKeyword]) + 2

            continue
          } else {
            // Just a table alias with no JOIN expression.
            json.FROM.push(table)
            i = i + 1
            continue
          }
        } else {
          // If it is a common table name, add it to FROM list.
          json.FROM.push(table)
          continue
        }
      }
    }

    // WHERE
    // ////////////////////////////////////////////////////////////////////

    if (foundWhere) {
      // After a WHERE there should be at least one condition and it will
      // have more al least 3 tokens: leftOperand, operator, rightOperand.
      if (whereIndex === numTokens - 3) throw error.invalidSQL(sql)

      json.WHERE = condition(tokens, whereIndex, select, sql)
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

      json.HAVING = condition(tokens, havingIndex, select, sql)
    }

    // ORDER BY
    // ////////////////////////////////////////////////////////////////////

    if (foundOrderBy) {
      json['ORDER BY'] = []

      for (i = orderByIndex + 1; i < numTokens; i++) {
        token = tokens[i]
        nextToken = tokens[i + 1]

        if (token === ',') continue

        // TODO probably this logic is incomplete
        if (isKeyword()(token)) break

        if (isStringNumber(token)) {
          token = parseFloat(token)
        }

        if (isDesc(nextToken)) {
          json['ORDER BY'].push({ DESC: token })
          i++
          continue
        }

        if (isAsc(nextToken)) {
          json['ORDER BY'].push({ ASC: token })
          i++
          continue
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

  // EXCEPT INTERSECT, UNION, UNION ALL
  // ////////////////////////////////////////////////////////////////////

  if (foundSetOperator) {
    json[setOperator] = select(tokens.splice(setOperatorIndex + 1), sql)
  }

  return json
}

module.exports = select
