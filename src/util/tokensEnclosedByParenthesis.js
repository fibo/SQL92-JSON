var error = require('../error')

/**
 * Extract a set of tokens enclosed by parenthesis
 *
 * ['(', 'a',  ')', 'bla bla'] => ['(', 'a',  ')']
 * ['xxx', '(', 'COUNT', '(', '*', ')', ')', 'xxx'] => ['(', 'COUNT', '(', '*', ')'  ')']
 *
 * @param {Array} tokens
 * @param {Number} startIndex
 *
 * @returns {Array} enclosedTokens
 */

function tokenEnclosedByParenthesis (tokens, startIndex) {
  var numTokens = tokens.length
  var enclosedTokens = []
  var foundLeftParenthesis = false
  var foundRightParenthesis = false
  var numOpenParenthesis = 0
  var token

  for (var i = startIndex; i < numTokens; i++) {
    token = tokens[i]

    if (token === '(') numOpenParenthesis++
    if (token === ')') numOpenParenthesis--

    if ((token === '(') && (numOpenParenthesis === 1)) {
      foundLeftParenthesis = true
    }

    // Nothing todo if left parenthesis was not found yet.
    if (!foundLeftParenthesis) continue

    enclosedTokens.push(token)

    if ((token === ')') && (numOpenParenthesis === 0)) {
      foundRightParenthesis = true
      break
    }
  }

  if (!foundRightParenthesis && foundLeftParenthesis) {
    throw error.unclosedParenthesisExpression(tokens)
  }

  return enclosedTokens
}

module.exports = tokenEnclosedByParenthesis
