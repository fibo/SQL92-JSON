var hasFrom = require('./hasFrom')
var isSelect = require('./isSelect')

/**
 * Convert JSON to SQL.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function stringify (json) {
  var sql = null

  if (isSelect(json)) {
    if (sql) sql += '\nSELECT '
    else sql = 'SELECT '

    sql += json.SELECT.join('\n\t')
  }

  if (hasFrom(json)) {
    sql += '\nFROM ' + json.FROM.join('\n\t')
  }

  return sql + '\n'
}

module.exports = stringify
