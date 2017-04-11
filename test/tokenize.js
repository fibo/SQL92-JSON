/* eslint-disable no-tabs */

var test = require('tape')

var tokenize = require('../src/util/tokenize')

test('tokenize', function (t) {
  t.deepEqual(tokenize('select'), ['select'])
  t.deepEqual(tokenize('  select   1'), ['select', '1'], 'left trim')
  t.deepEqual(tokenize('select * from sales '), ['select', '*', 'from', 'sales'], 'right trim')
  t.deepEqual(tokenize("select 'hello'"), ['select', "'hello'"], 'single quotes')
  t.deepEqual(tokenize("  select  'x'   as  y"), ['select', "'x'", 'as', 'y'], 'internal space chars')
  t.deepEqual(tokenize('select 1,2'), ['select', '1', ',', '2'], 'commas')
// TODO  t.deepEqual(tokenize('select \'select\' "select"'), ['select', "'select'", '"select"'], 'silly query')
  t.deepEqual(tokenize('group by'), ['group by'], 'GROUP BY')
  t.deepEqual(tokenize('ORDER by'), ['ORDER by'], 'ORDER BY')
  t.deepEqual(tokenize('COUNT(*)'), ['COUNT', '(', '*', ')'], 'COUNT(*)')
  t.deepEqual(tokenize('1::VARCHAR'), ['1::VARCHAR'], 'cast')

  t.deepEqual(tokenize(`
SELECT COUNT(    *) AS num
FROM (
	SELECT *
	FROM mytable
	WHERE yyyymmdd=20170101
		AND country IN ( 'IT', 'US' )
		AND (
			categoryid BETWEEN 100 AND 200
			OR productname != 'icecream'
		)
)
  `), [
    'SELECT', 'COUNT', '(', '*', ')', 'AS', 'num',
    'FROM', '(',
    'SELECT', '*',
    'FROM', 'mytable',
    'WHERE', 'yyyymmdd', '=', '20170101',
    'AND', 'country', 'IN', '(', "'IT'", ',', "'US'", ')',
    'AND', '(',
    'categoryid', 'BETWEEN', '100', 'AND', '200',
    'OR', 'productname', '!=', "'icecream'",
    ')',
    ')'
  ], 'readme example')

  t.end()
})
