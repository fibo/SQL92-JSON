var test = require('tape')

var splitOnParenthesisAndCommas = require('../src/util/splitOnParenthesisAndCommas')

test('splitOnParenthesisAndCommas', function (t) {
  t.deepEqual(splitOnParenthesisAndCommas('word'), ['word'], 'single word')
  t.deepEqual(splitOnParenthesisAndCommas(' in (1, 2)'), ['in', '(', '1', ',', '2', ')'], 'IN condition')
  t.deepEqual(splitOnParenthesisAndCommas('COUNT(  1)'), ['COUNT', '(', '1', ')'], 'COUNT(1) with spaces')
  t.deepEqual(splitOnParenthesisAndCommas('COUNT( DISTINCT countries )'), ['COUNT', '(', 'DISTINCT', 'countries', ')'], 'COUNT DISTINCT')
  t.deepEqual(splitOnParenthesisAndCommas('SUM(num)'), ['SUM', '(', 'num', ')'], 'SUM(num)')
  t.deepEqual(splitOnParenthesisAndCommas('1,2, 3  ,  4  '), ['1', ',', '2', ',', '3', ',', '4'], 'only commas')
  t.deepEqual(splitOnParenthesisAndCommas('TO_DATE( 20170321,  '), ['TO_DATE', '(', '20170321', ','])

  t.end()
})
