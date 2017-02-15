var isString = require('./util/isString')

/**
 * Can map a list of GROUP BY directives to a SQL statement.
 *
 * "field1" => "field1"
 *
 * @param {Object|String} condition
 *
 * @returns {String} result
 */

function groupByCondition (condition) {
  if (isString(condition)) return condition
}

module.exports = groupByCondition
