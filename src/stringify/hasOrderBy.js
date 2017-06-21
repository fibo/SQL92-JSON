var isNumberOrString = require('../util/isNumberOrString')
var isObject = require('../util/isObject')

/**
 * Check that expression has an ORDERBY BY.
 *
 * { 'ORDER BY': [1] } => true
 * { 'ORDER BY': [ { DESC: 'name' } ] } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function hasOrderBy (json) {
  var ORDERBY = json['ORDER BY']
  if (!ORDERBY) return false

  var isArrayWithElements = Array.isArray(ORDERBY) && ORDERBY.length > 0
  if (!isArrayWithElements) return false

  function validElements (element) {
    if (isNumberOrString(element)) return true

    if (isObject(element)) {
      if (isNumberOrString(element.DESC)) return true
      if (isNumberOrString(element.ASC)) return true
    }

    return false
  }

  var allElementsAreOk = ORDERBY.filter(validElements).length === ORDERBY.length

  return allElementsAreOk
}

module.exports = hasOrderBy
