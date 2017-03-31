var test = require('tape')

var normalizeSQL = require('../src/util/normalizeSQL')

test('normalizeSQL', function (t) {
  t.equal(normalizeSQL(' select 1'), 'select 1', 'trim left')
  t.equal(normalizeSQL('Select 1 '), 'Select 1', 'trim right')
  t.equal(normalizeSQL('select COUNT( 1  )'), 'select COUNT(1)', 'parenthesis spacing')
  t.equal(normalizeSQL('IN (1,2,   3 )'), 'IN (1, 2, 3)', 'comma spacing')

  var sql = "SELECT * FROM mytable WHERE yyyymmdd = 20170101 AND country IN ('IT', 'US')"
  t.equal(normalizeSQL(sql), sql, 'idempotent')

  t.end()
})
