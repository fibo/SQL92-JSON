function unclosedParenthesisExpression (tokens) {
  var message = 'Unclosed parenthesis'

  var error = new Error(message)
  error.tokens = tokens

  return error
}

module.exports = unclosedParenthesisExpression
