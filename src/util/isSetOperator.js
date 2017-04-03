var setOperators = require('../setOperators.json')

function isSetOperator (operator) {
  return function (token) {
    var TOKEN = token.toUpperCase()

    if (setOperators.indexOf(TOKEN) === -1) return false

    return operator === TOKEN
  }
}

module.exports = isSetOperator
