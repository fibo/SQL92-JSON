const test = require('tape')

const normalizeSQL = require('src/util/normalizeSQL')

const sql2json = require('sql92-json').parse
const json2sql = require('sql92-json').stringify

const addHeader = (header, query) => {
  return {
    SELECT: header,
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
const sqlSpool = `
SELECT 'name', 'color', 'quantity', 'when_eat'
UNION
SELECT name::VARCHAR, color::VARCHAR, quantity::VARCHAR, when_eat::VARCHAR
FROM fruit
`

test('recipe spool-header', function (t) {
  // Parse SQL and serialize it to JSON.
  const query = sql2json(sql)

  // Enclose fields with single quotes.
  const header = query.SELECT.map((field) => `'${field}'`)

  const queryWithHeader = addHeader(header, query)

  // Stringify the generated JSON back into SQL.
  const sqlWithHeader = json2sql(queryWithHeader)

  t.equal(normalizeSQL(expectedSqlWithHeader), sqlWithHeader, 'add header')

  // Add LIMIT clause.
  const queryStar = sql2json(sqlStar)
  queryStar.LIMIT = 1

  t.equal(normalizeSQL(sqlWithLimit), json2sql(queryStar), 'add limit')

  // Cast to VARCHAR to make UNION data types compatible.
  const fields = [ 'name', 'color', 'quantity', 'when_eat' ]

  const spool = {
    SELECT: fields.map((field) => `'${field}'`),
    UNION: {
      SELECT: fields.map((field) => `${field}::VARCHAR`),
      FROM: ['fruit']
    }
  }

  t.equal(normalizeSQL(sqlSpool), json2sql(spool), 'cast to VARCHAR')

  t.end()
})
