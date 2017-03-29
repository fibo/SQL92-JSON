var test = require('tape')

var normalizeSQL = require('../src/util/normalizeSQL')

test('normalizeSQL', function (t) {
  t.equal(normalizeSQL(' select 1'), 'select 1', 'trim left')
  t.equal(normalizeSQL('select 1 '), 'select 1', 'trim right')

  t.end()
})
