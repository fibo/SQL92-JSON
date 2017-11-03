var isNumberOrString = require('../util/isNumberOrString')
var isObject = require('../util/isObject')

/**
 * Check that expression has an ORDER_BY BY.
 *
 * { 'ORDER BY': [1] } => true
 * { 'ORDER BY': [ { DESC: 'name' } ] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasOrderBy (json) {
  var ORDER_BY = json['ORDER BY']
  if (!ORDER_BY) return false

  var isArrayWithElements = Array.isArray(ORDER_BY) && ORDER_BY.length > 0
  if (!isArrayWithElements) return false

  function validElements (element) {
    if (isNumberOrString(element)) return true

    if (isObject(element)) {
      if (isNumberOrString(element.DESC)) return true
      if (isNumberOrString(element.ASC)) return true
    }

    return false
  }

  var allElementsAreOk = ORDER_BY.filter(validElements).length === ORDER_BY.length

  return allElementsAreOk
}

module.exports = hasOrderBy
