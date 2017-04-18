function invalidOperand (operand) {
  var message = 'Invalid operand'
  if (operand) message += ': ' + operand

  var error = new Error(message)
  error.operand = operand

  return error
}

module.exports = invalidOperand
