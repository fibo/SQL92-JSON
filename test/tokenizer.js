/* eslint-disable no-tabs */

var test = require('tape')

var tokenizer = require('../src/tokenizer')

test('tokenizer', function (t) {
  t.deepEqual(tokenizer('select'), ['select'])
  t.deepEqual(tokenizer('  select   1'), ['select', '1'])
  t.deepEqual(tokenizer('select * from sales '), ['select', '*', 'from', 'sales'])
  t.deepEqual(tokenizer("select 'hello'"), ['select', "'hello'"])
  t.deepEqual(tokenizer("select 'hello' from table"), ['select', "'hello'", 'from', 'table'])
  t.deepEqual(tokenizer("  select  'x'   as  y"), ['select', "'x'", 'as', 'y'])
// TODO  t.deepEqual(tokenizer('select \'select\' "select"'), ['select', "'select'", '"select"'])

  t.deepEqual(tokenizer(`
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
  /*
*/
  t.end()
})
