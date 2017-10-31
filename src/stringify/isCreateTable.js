var isDataType = require('../util/isDataType')
var isTableName = require('../util/isTableName')
var isSelect = require('./isSelect')
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
 * {
 *   'CREATE TABLE': {
 *     name: 'mytable',
 *     AS: { SELECT ['*'], FROM: ['foo'] }
 * } => true
 *
 * @param {Object} json
 *
 * @returns {Boolean}
 */

function isCreateTable (json) {
  var CREATE_TABLE = json['CREATE TABLE']

  if (!CREATE_TABLE) return false

  if (!isTableName(CREATE_TABLE.name)) return false

  if (Array.isArray(CREATE_TABLE.fields)) {
    var numFields = CREATE_TABLE.fields.length

    if (numFields === 0) return false

    for (var i = 0; i < numFields; i++) {
      var field = CREATE_TABLE.fields[i]

      if (!isValidName(field[0])) return false
      if (!isDataType(field[1])) return false
    }

    return true
  }

  if (isSelect(CREATE_TABLE.AS)) return true

  return false
}

module.exports = isCreateTable
