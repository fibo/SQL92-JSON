var encloseWithParenthesis = require('./util/encloseWithParenthesis')
var isBetween = require('./isBetween')
var isSelect = require('./isSelect')
var quoteIfString = require('./util/quoteIfString')

var isArray = Array.isArray

var comparisonOperators = ['=', '>', '<', '<>', '<=', '>=', '!=']

/**
 * Extract WHERE filter.
 *
 * @param {Function} stringify
 *
 * @returns {Function} stringifyFilter
 */

function whereFilter (stringify) {
 /**
  *
  * @param {Object} filter
  *
  * @returns {String} result
  */

  return function stringifyFilter (filter) {
    var i

    for (i = 0; i < comparisonOperators.length; i++) {
      var operator = comparisonOperators[i]
      var operand = filter[operator]

      if (typeof operand !== 'undefined') {
        return operator + ' ' + quoteIfString(operand)
      }
    }

    var IN = filter.IN

    if (IN) {
      if (isArray(IN)) {
        return 'IN ' + encloseWithParenthesis(filter.IN.map(quoteIfString).join(', '))
      }

      if (isSelect(IN)) {
        return 'IN ' + encloseWithParenthesis(stringify(IN))
      }
    }

    var AND = filter.AND

    if (isArray(AND)) {
      var stringyfiedAND = AND[0] + ' ' + stringifyFilter(AND[1])

      for (i = 2; i < AND.length; i++) {
        stringyfiedAND += ' ' + stringifyFilter(AND[i])
      }

      if (AND.length === 2) {
        return 'AND ' + stringyfiedAND
      } else {
        return 'AND ' + encloseWithParenthesis(stringyfiedAND)
      }
    }

    var BETWEEN = filter.BETWEEN

    if (isBetween(filter)) {
      return 'BETWEEN ' + BETWEEN.map(quoteIfString).join(' AND ')
    }

    var OR = filter.OR

    if (isArray(OR)) {
      var stringyfiedOR = OR[0] + ' ' + stringifyFilter(OR[1])

      for (i = 2; i < OR.length; i++) {
        stringyfiedOR += ' ' + stringifyFilter(OR[i])
      }

      if (OR.length === 2) {
        return 'OR ' + stringyfiedOR
      } else {
        return 'OR ' + encloseWithParenthesis(stringyfiedOR)
      }
    }
  }
}

module.exports = whereFilter
