var test = require('tape')

var sumExpression = require('stringify/sumExpression')

test('sumExpression', function (t) {
  t.equal(sumExpression({ SUM: 'num' }), 'SUM(num)', 'SUM(num)')

  t.end()
})
