var test = require('tape')

var countExpression = require('src/stringify/countExpression')

test('countExpression', function (t) {
  t.equal(countExpression({ COUNT: '*' }), 'COUNT(*)', 'COUNT(*)')
  t.equal(countExpression({ COUNT: 'foo' }), 'COUNT(foo)', 'COUNT(foo)')
  t.equal(countExpression({ COUNT: 'foo', DISTINCT: true }), 'COUNT(DISTINCT foo)', 'COUNT(DISTINCT foo)')

  t.end()
})
