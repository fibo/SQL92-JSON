var splitOnParenthesis = require('./splitOnParenthesis')

/**
 * Analyze SQL and convert into a list of tokens.
 *
 * @param {String} sql
 *
 * @returns {Array} tokens
 */

function tokenize (sql) {
  var tokens = []

  // Trim and analyze single quotes first. They are special characters in SQL.

  // No SQL statement can start with a quoted word.
  var isQuoted = false
  var currentQuotedValue = ''

  sql.trim().split("'").forEach(function (currentValue, index, array) {
    var nextValue

    if (isQuoted) {
      // Concatenate currentValue with currentQuotedValue, if any, cause
      // previous value could be quoted as well.
      if (currentQuotedValue === '') {
        currentQuotedValue = currentValue
      } else {
        currentQuotedValue += "'" + currentValue
      }

      // Return if it is last element, otherwise nextValue will be undefined.
      if (index === array.length - 1) {
        tokens.push("'" + currentQuotedValue)

        return
      } else {
        // A single quote can be escaped by another single quote.
        //
        // > var sql = "select 'O''Reilly';"
        // > sql.split(/'/)
        // [ 'select ', 'O', '', 'Reilly', ';' ]

        nextValue = array[index + 1]

        // If currentValue is quoted and two consecutive single quotes are found,
        // return to avoid toggling the isQuoted flag, hence nextValue will
        // be considered quoted and concatenated to currentQuotedValue.
        //
        // Otherwise just push the quoted token found.
        if (nextValue === '') {
          return
        } else {
          tokens.push("'" + currentQuotedValue + "'")
        }
      }
    } else {
      // Reset currentQuotedValue for next iteration
      currentQuotedValue = ''

      // Now let's care about double quotes, they are valid outside single
      // quotes and can concatenate more words into one token, for example
      //
      // select 1 as "number one";

      var currentToken = ''

      // The currentToken, after trimmed, could start with a double quote
      //
      // select 'select' "select"
      //

      currentValue = currentValue.trim()
      var isDoubleQuoted = currentValue[0] === '"'

      currentValue.split('').forEach(function (currentChar, index, array) {
        // Special characters are considered as a space.
        var isEquivalentToSpace = (
          (currentChar === '\n') ||
          (currentChar === '\r') ||
          (currentChar === '\t')
        )

        if ((currentChar === ' ') || isEquivalentToSpace) {
          if (isDoubleQuoted) {
            currentToken += ' '
          } else {
            if (currentToken !== '') {
              // Close current token, only if it is valued otherwise many
              // equivalent to space characters concatenated will produce
              // empty tokens.
              tokens = tokens.concat(splitOnParenthesis(currentToken))

              currentToken = ''
            }
          }
        } else {
          if (currentChar === '"') {
            if (isDoubleQuoted) {
              // Close current double quoted token.
              isDoubleQuoted = false
              tokens.push(currentToken + '"')
              currentToken = ''
            } else {
              // Start a new double quoted token.
              isDoubleQuoted = true
              currentToken = '"'
            }
          } else {
            currentToken += currentChar

            // Push it, f it is last token.
            if (index === array.length - 1) {
              tokens = tokens.concat(splitOnParenthesis(currentToken))
            }
          }
        }
      })
    }

    // Toggle the isQuoted flag:
    // if currentValue is quoted the next one will not, and viceversa.
    isQuoted = !isQuoted
  })

  return tokens
}

module.exports = tokenize
