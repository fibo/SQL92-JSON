var isMathOperator = require('./isMathOperator')

function extractMathExpression (tokens) {
  var expression = []

  var missingRightOperand
  var token
  var nextToken

  // TODO: handle parenthesis

  // All math operators are binary.
  // Look for operators: start from second token.
  for (var i = 0; i < tokens.length - 1; i++) {
    token = tokens[i]
    nextToken = tokens[i + 1]

    if (isMathOperator(nextToken)) {
      expression.push(token, nextToken)

      i = i + 1

      missingRightOperand = true
    } else {
      if (missingRightOperand) {
        expression.push(token)
        missingRightOperand = false
        return expression
      }
    }
  }

  return expression
}

module.exports = extractMathExpression
