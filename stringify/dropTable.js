function dropTable (json) {
  var tableName = json['DROP TABLE']

  return 'DROP TABLE ' + tableName
}

module.exports = dropTable
