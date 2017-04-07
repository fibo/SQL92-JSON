var isString = require('../util/isString')
var doubleQuoteIfStringContainsSpace = require('../util/doubleQuoteIfStringContainsSpace')

/**
 * Stringify as AS expression.
 *
 * { AS: "myalias" }  => ' AS myalias'
 * { AS: "my count" } => ' AS "my count"'
 * { }                => ''
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function aliasExpression (json) {
  var result = ''

  var AS = json.AS

  if (isString(AS)) {
    result += ' AS ' + doubleQuoteIfStringContainsSpace(AS)
  }

  return result
}

module.exports = aliasExpression
