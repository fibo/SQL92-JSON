var test = require('tape')

var isTableName = require('../src/util/isTableName')

test('isTableName', function (t) {
  t.ok(isTableName('my_table2'), 'with numbers and underscores')
  t.ok(isTableName('_mytable'), 'can start with underscore')
  t.ok(isTableName('myschema.mytable'), 'can have schema')
  t.notOk(isTableName('2mytable'), 'cannot start with a number')

  t.end()
})
