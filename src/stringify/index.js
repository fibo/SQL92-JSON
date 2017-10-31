var isCreateTable = require('./isCreateTable')
var isSelect = require('./isSelect')
var select = require('./select')

/**
 * Convert JSON to SQL.
 *
 * @param {Object} json
 *
 * @returns {String} sql
 */

function stringify (json) {
  var sql = ''

  if (isCreateTable(json)) {
    var CREATE_TABLE = json['CREATE TABLE']

    sql = 'CREATE TABLE ' + CREATE_TABLE.name

    var tableFields = CREATE_TABLE.fields

    if (tableFields) {
      sql += ' ('

      tableFields.forEach(function (field, index, fields) {
        sql += field[0] + ' ' + field[1]

        if (index === fields.length - 1) {
          sql += ')'
        } else {
          sql += ', '
        }
      })
    }

    if (CREATE_TABLE.AS) sql += ' AS ' + stringify(CREATE_TABLE.AS)
  }

  if (isSelect(json)) {
    // A SELECT statement could be a continuation of an INSERT,
    // so it is necessary to add a space separator in between.
    if (sql) sql += ' '

    sql += select(json, sql)
  }

  return sql
}

module.exports = stringify
