var error = require('../error')
var isKeywordOrOperator = require('../util/isKeywordOrOperator')
var isStringNumber = require('../util/isStringNumber')

function comparison (leftOperand, operator, rightOperand) {
  var condition = {}

  if (isKeywordOrOperator(leftOperand)) throw error.invalidOperand(leftOperand)
  if (isKeywordOrOperator(rightOperand)) throw error.invalidOperand(rightOperand)

  if (isStringNumber(leftOperand)) {
    leftOperand = parseFloat(leftOperand)
  }

  if (isStringNumber(rightOperand)) {
    rightOperand = parseFloat(rightOperand)
  }

  condition[operator] = rightOperand

  return [leftOperand, condition]
}

module.exports = comparison
