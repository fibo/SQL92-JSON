var test = require('tape')

var hasOrderBy = require('stringify/hasOrderBy')

test('hasOrderBy', function (t) {
  t.ok(hasOrderBy({ 'ORDER BY': [ 1, 'name' ] }), 'array of numbers or strings')
  t.ok(hasOrderBy({ 'ORDER BY': [{ DESC: 1 }] }), 'DESC')
  t.ok(hasOrderBy({ 'ORDER BY': [{ ASC: 1 }] }), 'ASC')

  t.end()
})
