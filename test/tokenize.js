/* eslint-disable no-tabs */

var test = require('tape')

var tokenize = require('../src/util/tokenize')

test('tokenize', function (t) {
  t.deepEqual(tokenize('select'), ['select'])
  t.deepEqual(tokenize('  select   1'), ['select', '1'])
  t.deepEqual(tokenize('select * from sales '), ['select', '*', 'from', 'sales'])
  t.deepEqual(tokenize("select 'hello'"), ['select', "'hello'"])
  t.deepEqual(tokenize("select 'hello' from table"), ['select', "'hello'", 'from', 'table'])
  t.deepEqual(tokenize("  select  'x'   as  y"), ['select', "'x'", 'as', 'y'])
// TODO  t.deepEqual(tokenize('select \'select\' "select"'), ['select', "'select'", '"select"'])

  t.deepEqual(tokenize(`
SELECT COUNT(    *) AS num
FROM (
	SELECT *
	FROM mytable
	WHERE yyyymmdd = 20170101
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
  ])

  t.end()
})
