const test = require('tape')

const normalizeSQL = require('src/util/normalizeSQL')

const sql2json = require('sql92-json').parse
const json2sql = require('sql92-json').stringify

const addHeader = (fields, query) => {
  return {
    SELECT: fields,
    UNION: query
  }
}

const sql = `
SELECT name, color, quantity, when_eat
FROM fruit
`

const expectedSqlWithHeader = `
SELECT 'name', 'color', 'quantity', 'when_eat'
UNION
SELECT name, color, quantity, when_eat
FROM fruit
`

const sqlStar = `
SELECT *
FROM fruit
`

const sqlWithLimit = `
SELECT *
FROM fruit
LIMIT 1
`

test('recipe spool-header', function (t) {
  // Parse SQL and serialize it to JSON.
  const query = sql2json(sql)

  // Enclose fields with single quotes.
  const fields = query.SELECT.map((field) => "'" + field + "'")

  const queryWithHeader = addHeader(fields, query)

  // Stringify the generated JSON back into SQL.
  const sqlWithHeader = json2sql(queryWithHeader)

  t.equal(normalizeSQL(expectedSqlWithHeader), sqlWithHeader, 'add header')

  // Add LIMIT clause.
  const queryStar = sql2json(sqlStar)
  queryStar.LIMIT = 1

  t.equal(normalizeSQL(sqlWithLimit), json2sql(queryStar), 'add limit')

  t.end()
})
