var isDataType = require('../util/isDataType')
var isTableName = require('../util/isTableName')
var isValidName = require('../util/isValidName')

/**
 * Check that expression is a CREATE TABLE.
 *
 * {
 *   'CREATE TABLE': {
 *     name: 'mytable',
 *     fields: [
 *       [ 'ok', 'BOOLEAN' ]
 *     ]
 * } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isCreateTable (json) {
  var CREATETABLE = json['CREATE TABLE']

  if (!CREATETABLE) return false

  if (!isTableName(CREATETABLE.name)) return false

  if (!Array.isArray(CREATETABLE.fields)) return false

  var numFields = CREATETABLE.fields.length

  if (numFields === 0) return false

  for (var i = 0; i < numFields; i++) {
    var field = CREATETABLE.fields[i]

    if (!isValidName(field[0])) return false
    if (!isDataType(field[1])) return false
  }

  return true
}

module.exports = isCreateTable
