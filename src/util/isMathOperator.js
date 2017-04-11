var mathOperators = require('../mathOperators.json')

function isMathOperator (token) {
  return mathOperators.indexOf(token) > -1
}

module.exports = isMathOperator
