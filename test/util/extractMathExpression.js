var test = require('tape')

var extractMathExpression = require('util/extractMathExpression')

test('extractMathExpression', function (t) {
  t.deepEqual(extractMathExpression(['SYSDATE', '-', '2', 'AND']), ['SYSDATE', '-', '2'], 'SYSDATE - 2')

  t.end()
})
