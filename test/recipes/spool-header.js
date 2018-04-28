/*
var test = require('tape')

var normalizeSQL = require('util/normalizeSQL')

var sql2json = require('sql92-json').parse
var json2sql = require('sql92-json').stringify

function addHeader (header, query) {
  return {
    SELECT: header,
    UNION: query
  }
}

var sql = `
SELECT name, color, quantity, when_eat
FROM fruit
`

var expectedSqlWithHeader = `
SELECT 'name', 'color', 'quantity', 'when_eat'
UNION
SELECT name, color, quantity, when_eat
FROM fruit
`

var sqlStar = `
SELECT *
FROM fruit
`

var sqlWithLimit = `
SELECT *
FROM fruit
LIMIT 1
`
var sqlSpool = `
SELECT name, color, quantity, when_eat
FROM (
  SELECT 1 AS i, 'name' AS name, 'color' AS color, 'quantity' AS quantity, 'when_eat' AS when_eat
  UNION
  SELECT 2 AS i, name::VARCHAR, color::VARCHAR, quantity::VARCHAR, when_eat::VARCHAR
  FROM fruit
)
ORDER BY i
`

test('recipe spool-header', (t) => {
  // Parse SQL and serialize it to JSON.
  var query = sql2json(sql)

  // Enclose fields with single quotes.
  var header = query.SELECT.map((field) => `'${field}'`)

  var queryWithHeader = addHeader(header, query)

  // Stringify the generated JSON back into SQL.
  var sqlWithHeader = json2sql(queryWithHeader)

  t.equal(normalizeSQL(expectedSqlWithHeader), sqlWithHeader, 'add header')

  // Add LIMIT clause.
  var queryStar = sql2json(sqlStar)
  queryStar.LIMIT = 1

  t.equal(normalizeSQL(sqlWithLimit), json2sql(queryStar), 'add limit')

  // Cast to VARCHAR to make UNION data types compatible.
  var fields = [ 'name', 'color', 'quantity', 'when_eat' ]
  var table = 'fruit'

  function spool (table, fields) {
    var header = fields.map((field) => {
      var alias = { AS: {} }
      alias.AS[field] = `'${field}'`
      return alias
    })

    return {
      SELECT: fields,
      FROM: [{
        SELECT: [{ AS: { i: 1 } }].concat(header),
        UNION: {
          SELECT: [{ AS: { i: 2 } }].concat(fields.map((field) => `${field}::VARCHAR`)),
          FROM: [table]
        }
      }],
      'ORDER BY': ['i']
    }
  }

  t.equal(normalizeSQL(sqlSpool), json2sql(spool(table, fields)), 'spool')

  t.end()
})
*/
