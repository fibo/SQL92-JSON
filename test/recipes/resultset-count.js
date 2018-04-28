/*
var test = require('tape')

var normalizeSQL = require('util/normalizeSQL')

var sql2json = require('sql92-json').parse
var json2sql = require('sql92-json').stringify

test('recipe resultset-count', (t) => {
  var query = sql2json('SELECT name FROM cities WHERE population > 10000')

  var expectedSql = `
SELECT COUNT(*) AS num_rows FROM (
  SELECT name FROM cities WHERE population > 10000
)
`

  t.equal(
    normalizeSQL(
      json2sql({
        SELECT: [{ COUNT: '*', AS: 'num_rows' }],
        FROM: [query]
      })
    ),
    normalizeSQL(expectedSql),
    'add count(*)'
  )

  t.end()
})
*/
