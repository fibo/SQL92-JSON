/**
 * Convert JSON to SQL.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function stringify (json) {
  return json.reduce((sql, { code }) => sql + code.join(''), '')
}

module.exports = stringify
