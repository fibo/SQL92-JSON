var test = require('tape')

var splitOnParenthesis = require('../src/util/splitOnParenthesis')

test('splitOnParenthesis', function (t) {
  t.deepEqual(splitOnParenthesis('COUNT(*)'), ['COUNT', '(', '*', ')'])
  t.deepEqual(splitOnParenthesis('COUNT(  1)'), ['COUNT', '(', '1', ')'])
  t.deepEqual(splitOnParenthesis('COUNT( DISTINCT countries )'), ['COUNT', '(', 'DISTINCT', 'countries', ')'])
  t.deepEqual(splitOnParenthesis('TO_DATE( 20170321, '), ['TO_DATE', '(', '20170321', ','])

  t.end()
})
