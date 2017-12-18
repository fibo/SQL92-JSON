var error = require('../error')

var encloseWithParenthesis = require('../util/encloseWithParenthesis')
var isBetween = require('./isBetween')
var isLike = require('./isLike')
var isNotLike = require('./isNotLike')
var isNotBetween = require('./isNotBetween')
var isSelect = require('./isSelect')
var quoteIfString = require('../util/quoteIfString')

var isArray = Array.isArray

var comparisonOperators = require('../util/comparisonOperators.json')

/**
 * Extract filter.
 *
 * @param {Function} select
 *
 * @returns {Function} stringifyFilter
 */

function filter (select) {
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

      if (isArray(operand)) {
        return operator + ' ' + operand.join(' ')
      }

      if (typeof operand !== 'undefined') {
        return operator + ' ' + operand
      }
    }

    var IN = filter.IN

    if (IN) {
      if (isArray(IN)) {
        return 'IN ' + encloseWithParenthesis(filter.IN.map(quoteIfString).join(', '))
      }

      if (isSelect(IN)) {
        if (typeof select === 'function') {
          return 'IN ' + encloseWithParenthesis(select(IN))
        } else {
          throw error.functionRequired('select')
        }
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
      return 'BETWEEN ' + BETWEEN.join(' AND ')
    }

    var NOT_BETWEEN = filter['NOT BETWEEN']

    if (isNotBetween(filter)) {
      return 'NOT BETWEEN ' + NOT_BETWEEN.join(' AND ')
    }

    var LIKE = filter.LIKE

    if (isLike(filter)) {
      return 'LIKE ' + LIKE
    }

    var NOT_LIKE = filter['NOT LIKE']

    if (isNotLike(filter)) {
      return 'NOT LIKE ' + NOT_LIKE
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

module.exports = filter
