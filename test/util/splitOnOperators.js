var test = require('tape')

var splitOnOperators = require('src/util/splitOnOperators')

test('splitOnOperators', function (t) {
  t.deepEqual(splitOnOperators('word'), ['word'], 'single word')
  t.deepEqual(splitOnOperators(' in (1, 2)'), ['in', '(', '1', ',', '2', ')'], 'IN condition')
  t.deepEqual(splitOnOperators('COUNT(  1)'), ['COUNT', '(', '1', ')'], 'COUNT(1) with spaces')
  t.deepEqual(splitOnOperators('COUNT( DISTINCT countries )'), ['COUNT', '(', 'DISTINCT', 'countries', ')'], 'COUNT DISTINCT')
  t.deepEqual(splitOnOperators('SUM(num)'), ['SUM', '(', 'num', ')'], 'SUM(num)')
  t.deepEqual(splitOnOperators('1,2, 3  ,  4  '), ['1', ',', '2', ',', '3', ',', '4'], 'only commas')
  t.deepEqual(splitOnOperators('TO_DATE( 20170321,  '), ['TO_DATE', '(', '20170321', ','])

  t.end()
})
