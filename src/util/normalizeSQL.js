/**
 * Clean up SQL statement and make it comparable.
 *
 * @param {String} sql
 *
 * @returns {String} result
 */

function normalizeSQL (sql) {
  sql = sql.trim()
  sql = sql.replace(/\n$/, '')
  sql = sql.replace(/[\t\n]+/g, ' ')

  return sql
}

module.exports = normalizeSQL
