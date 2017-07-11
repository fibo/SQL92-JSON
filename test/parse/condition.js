var test = require('tape')

var condition = require('src/parse/condition')
var select = require('src/parse/select')
var tokenize = require('src/util/tokenize')

test('condition', function (t) {
  var sql1 = 'SELECT day, region, COUNT(*) FROM mytable WHERE foo = bar GROUP BY day, region'
  t.deepEqual(condition(tokenize(sql1), 8, select, sql1), ['foo', { '=': 'bar' }], 'simple =')

  t.end()
})
