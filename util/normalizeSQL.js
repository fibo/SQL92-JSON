var isFunction = require('./isFunction')
var tokenize = require('./tokenize')

/**
 * Clean up SQL statement and make it comparable.
 *
 * @param {String} sql
 *
 * @returns {String} result
 */

function normalizeSQL (sql) {
  var result

  var tokens = tokenize(sql)

  tokens.forEach(function (currentValue, index, array) {
    var isFirstValue = index === 0
    var previousValue

    if (isFirstValue) {
      result = currentValue
      return
    } else {
      previousValue = array[index - 1]
    }

    switch (currentValue) {
      case '(':
        if (isFunction(previousValue)) {
          result += '('
        } else {
          result += ' ('
        }
        break
      case ')':
        result += ')'
        break
      default:
        if ((previousValue === '(') || (currentValue === ',')) {
          result += currentValue
        } else {
          result += ' ' + currentValue
        }
    }
  })

  return result
}

module.exports = normalizeSQL
