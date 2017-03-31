var comparisonOperators = require('../comparisonOperators.json')

/**
 * Take a string that is supposed to be not quoted or double quoted.
 * Split it on any operator: comma, parenthesis, comparison operators, etc.
 * Furthermore, content is trimmed and splitted on comma or spaces.
 *
 * 'COUNT(*)' => ['COUNT', '(', '*', ')']
 * 'COUNT( 1   )' => ['COUNT', '(', '1', ')']
 * 'COUNT( DISTINCT cities )' => ['COUNT', '(', 'DISTINCT', 'cities', ')']
 * 'yyyymmdd=20170101' => ['yyyymmdd', '=', '20170101']
 *
 * @param {String} notQuotedString
 *
 * @return {Array} tokens
 */

var semiOperators = ['>', '<', '!']

var otherOperators = ['(', ')', ',', ';']

var operators = comparisonOperators.concat(otherOperators)

function splitOnOperators (notQuotedString) {
  var tokens = []

  function blanks (x) { return x !== '' }

  notQuotedString.trim().split(' ').filter(blanks).forEach(function (word) {
    var currentToken = ''
    var numCharacters = word.length

    for (var i = 0; i < numCharacters; i++) {
      var character = word[i]

      var isLastCharacter = i === numCharacters - 1

      var characterIsOperator = operators.indexOf(character) > -1
      var characterIsSemiOperator = semiOperators.indexOf(character) > -1

      var nextCharacter

      if (characterIsSemiOperator && (!isLastCharacter)) {
        nextCharacter = word[i + 1]

        var maybeOperator = character + nextCharacter

        var actuallyItIsOperator = operators.indexOf(maybeOperator) > -1

        if (actuallyItIsOperator) {
          if (currentToken !== '') tokens.push(currentToken)

          tokens.push(maybeOperator)

          currentToken = ''

          i = i + 1
        }
      }

      if (characterIsOperator) {
        if (currentToken !== '') tokens.push(currentToken)

        tokens.push(character)

        currentToken = ''
      } else {
        currentToken += character

        if (isLastCharacter) tokens.push(currentToken)
      }
    }
  })

  return tokens
}

module.exports = splitOnOperators
