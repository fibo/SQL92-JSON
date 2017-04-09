var setOperators = require('../setOperators.json')

function isSetOperator (operator) {
  return function (token) {
    if (!token) return

    var TOKEN = token.toUpperCase()

    if (setOperators.indexOf(TOKEN) === -1) return false

    return operator === TOKEN
  }
}

module.exports = isSetOperator
