var extractMathExpression = require('../util/extractMathExpression')
var isComparisonOperator = require('../util/isComparisonOperator')
var isMathOperator = require('../util/isMathOperator')
var isStringNumber = require('../util/isStringNumber')

function comparison (tokens) {
  var condition = {}
  var leftOperand
  var operator
  var operatorIndex
  var rightOperand
  var token

  // Look for first operator.
  for (var i = 0; i < tokens.length; i++) {
    token = tokens[i]

    if (isComparisonOperator(token)) {
      operator = token
      operatorIndex = i
      break
    }
  }

  // TODO check if operator was found, otherwise raise an error.
  // TODO check also operatorIndex, should be greater than 0.

  // TODO extract math expressions on left side.
  // probably it would be necessary to use the same logic of right
  // math expression but reversing the tone array.
  // Maybe it needs also to change JSON syntax.
  leftOperand = tokens[operatorIndex - 1]

  if (isStringNumber(leftOperand)) {
    leftOperand = parseFloat(leftOperand)
  }

  if (isMathOperator(tokens[operatorIndex + 2])) {
    rightOperand = extractMathExpression(tokens.slice(operatorIndex + 1))

    // Convert number from strings.
    rightOperand = rightOperand.map(function (element) {
      if (isStringNumber(element)) return parseFloat(element)
      else return element
    })
  } else {
    rightOperand = tokens[operatorIndex + 1]

    if (isStringNumber(rightOperand)) {
      rightOperand = parseFloat(rightOperand)
    }
  }

  condition[operator] = rightOperand

  return [leftOperand, condition]
}

module.exports = comparison
