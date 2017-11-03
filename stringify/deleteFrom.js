var conditions = require('./conditions')
var hasWhere = require('./hasWhere')
var select = require('./select')

function deleteFrom (json) {
  var tableName = json['DELETE FROM']

  var sql = 'DELETE FROM ' + tableName

  if (json.WHERE) {
    if (hasWhere(json)) {
      sql += ' WHERE ' + conditions(select)(json.WHERE)
    }
  }

  return sql
}

module.exports = deleteFrom
