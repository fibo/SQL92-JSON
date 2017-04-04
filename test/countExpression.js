var test = require('tape')

var countExpression = require('../src/countExpression')

test('countExpression', function (t) {
  t.equal(countExpression({ COUNT: '*' }), 'COUNT(*)', 'COUNT(*)')

  t.end()
})
