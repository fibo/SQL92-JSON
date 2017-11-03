function createTable (json, stringify) {
  var CREATE_TABLE = json['CREATE TABLE']

  var sql = 'CREATE TABLE ' + CREATE_TABLE.name

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

  return sql
}

module.exports = createTable
