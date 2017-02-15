var isAlias = require('./isAlias')
var isStar = require('./util/isStar')

/**
 * Stringify COUNT expression
 *
 * @param {Object} json
 *
 * @returns {String} result
 */

function countExpression (json) {
  var COUNT = json.COUNT

  if (isAlias(json)) {
    var aliasName = json.AS

    if (isStar(COUNT)) return 'COUNT(*) AS ' + aliasName
    if (COUNT === 1) return 'COUNT(1) AS ' + aliasName
  } else {
    if (isStar(COUNT)) return 'COUNT(*)'
    if (COUNT === 1) return 'COUNT(1)'
  }
}

module.exports = countExpression
