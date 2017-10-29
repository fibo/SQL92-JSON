var error = require('../error')

var doubleQuoteIfStringContainsSpace = require('../util/doubleQuoteIfStringContainsSpace')
var encloseWithParenthesis = require('../util/encloseWithParenthesis')
var isNumber = require('../util/isNumber')
var isObject = require('../util/isObject')
var isSelect = require('./isSelect')
var isString = require('../util/isString')
var stringField = require('./stringField')

/**
 * Stringify as AS expression.
 *
 * { AS: 'myalias' }  => ' AS myalias'
 * { AS: 'my count' } => ' AS "my count"'
 * { AS: { num: 1 } } => ' 1 AS num'
 * { AS: { num: { SELECT: ['foo'], FROM: ['mytable'] } } } => '(SELECT foo FROM mytable) AS num'
 * { }                => ''
 *
 * @param {Object} json
 * @param {Function} [select]
 *
 * @returns {String} result
 */

function aliasExpression (json, select) {
  var alias
  var field
  var result = ''

  var AS = json.AS

  if (isString(AS)) {
    result += ' AS ' + doubleQuoteIfStringContainsSpace(AS)
  }

  if (isObject(AS)) {
    alias = Object.keys(AS)

    if (alias.length > 1) {
      throw error.invalidAlias(json)
    } else {
      // Alias is ok, it must contain only one key, the alias.
      alias = alias[0]
    }

    field = AS[alias]

    if (isNumber(field)) result = field

    if (isString(field)) result = stringField(field)

    if (isSelect(field)) {
      if (typeof select === 'function') {
        result = encloseWithParenthesis(select(field))
      } else {
        throw error.functionRequired('select')
      }
    }

    result += ' AS ' + doubleQuoteIfStringContainsSpace(alias)
  }

  return result
}

module.exports = aliasExpression
