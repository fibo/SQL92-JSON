var test = require('tape')

var isFieldName = require('src/util/isFieldName')

test('isFieldName', function (t) {
  t.ok(isFieldName('field'), 'field')
  t.ok(isFieldName('table.field'), 'table.field')
  t.ok(isFieldName('schema.table.field'), 'schema.table.field')

  t.end()
})
