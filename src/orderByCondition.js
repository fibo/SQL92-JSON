var isNumberOrString = require('./util/isNumberOrString')
var isObject = require('./util/isObject')

/**
 * Can map a list of ORDER BY directives to a SQL statement.
 *
 * { DESC: 2 } => 2 DESC
 *
 * @param {Object|String} condition
 *
 * @returns {String} result
 */

function orderByCondition (condition) {
  if (isNumberOrString(condition)) return condition

  if (isObject(condition)) {
    if (isNumberOrString(condition.DESC)) return condition.DESC + ' DESC'
    if (isNumberOrString(condition.ASC)) return condition.ASC + ' ASC'
  }
}

module.exports = orderByCondition
