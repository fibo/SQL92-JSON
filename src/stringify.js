/**
 * Convert JSON to SQL.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function stringify (json) {
  return json.reduce((sql, { code, data }) => (
    data ? sql + stringify(data) : sql + code.join('')
  ), '')
}

module.exports = stringify
