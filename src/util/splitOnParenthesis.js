/**
 * Take a string that is supposed to be not quoted or double quoted
 * and split it on left and right parenthesis to get tokens, with parenthesis
 * included.
 *
 * 'COUNT(*)' => ['COUNT', '(', '*', ')']
 *
 * Furthermore, list content is trimmed and splitted on comma or spaces.
 *
 * 'COUNT( 1   )' => ['COUNT', '(', '1', ')']
 * 'COUNT( DISTINCT cities )' => ['COUNT', '(', 'DISTINCT', 'cities', ')']
 *
 * @param {String} notQuotedString
 *
 * @return {Array} tokens
 */

function splitOnParenthesis (notQuotedString) {
  // Do nothing if input string does not contain parenthesis.
  if ((notQuotedString.indexOf('(') === -1) && (notQuotedString.indexOf(')') === -1)) return [notQuotedString]

  var tokens = []

  notQuotedString.split('(').forEach(function (tokenWithoutLeftParenthesis, index, array) {
    tokenWithoutLeftParenthesis.split(')').forEach(function (params, index, array) {
      params.trim().split(',').forEach(function (token, index, array) {
        if (token !== '') {
          token.split(' ').forEach(function (word) {
            if (word !== '') tokens.push(word)
          })

          if (index < array.length - 1) tokens.push(',')
        }
      })

      if (index < array.length - 1) tokens.push(')')
    })

    if (index < array.length - 1) tokens.push('(')
  })

  return tokens
}

module.exports = splitOnParenthesis
