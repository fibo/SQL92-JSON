---
title: Prepend spool header
permalink: /recipes/spool-header/
---

# Spool header

[test source](https://github.com/fibo/SQL92-JSON/blob/master/test/recipes/spool-header.js)

When downloading data of a result set into a file (action known also as *spool*)
for example into a CSV file, it is useful to add an *header*, i.e. write
in the first row the field names.

Suppose that our statement is

```sql
SELECT name, color, quantity, when_eat
FROM fruit
```

If the database you are using does not support this feature out of the box,
the common trick is to prepend a statement that adds a single row with the
header, something like

```sql
SELECT 'name', 'color', 'quantity', 'when_eat'
UNION
SELECT name, color, quantity, when_eat
FROM fruit
```

To transform the first statement into the second one you can do

```javascript
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

// Serialize query.
var query = sql2json(sql)

// Enclose fields with single quotes.
var header = query.SELECT.map((field) => "'" + field + "'")

var queryWithHeader = addHeader(header, query)

// Stringify the generated JSON back into SQL.
var sqlWithHeader = json2sql(queryWithHeader)

console.log(sqlWithHeader)
// SELECT 'name', 'color', 'quantity', 'when_eat'
// UNION
// SELECT name, color, quantity, when_eat
// FROM fruit
```

Actually my use case is more complex cause I need to add an header to a
SQL statement that could be also like `SELECT * FROM fruit` and
furthermore I am using an `UNLOAD` statement on Redshift, hence the data
file is spooled on S3 but it does not return any data so it is not even
possible to read the first row and get the fields.

I am using the following function to generate the `UNLOAD` statement.

```javascript
var json2sql = require('sql92-json').stringify

function generateUnloadSQL (s3File, queryJSON) {
  var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
  var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID

  var credentials = `'aws_access_key_id=${AWS_ACCESS_KEY_ID};aws_secret_access_key=${AWS_SECRET_ACCESS_KEY}'`

  var querySQL = json2sql(queryJSON).replace(/'/g, "\\'")

  var s3Bucket = s3File.Bucket
  // The unload command appends a '000.gz', hence it must be stripped.
  var s3FileKey = s3File.Key.replace(/\.000\.gz$/, '')

  return `
UNLOAD('${querySQL}')
TO 's3://${s3Bucket}/${s3FileKey}.'
CREDENTIALS ${credentials}
DELIMITER AS ';'
ADDQUOTES
ALLOWOVERWRITE
PARALLEL FALSE
GZIP
`
}
```

A generic solution to this use case is to fetch the fields from a query
like `SELECT * FROM fruit LIMIT 1`, then apply the previous transformation
to get a statement that returns an header in the first row.
This is as easy as the following snippet

```javascript
var sqlStar = `
SELECT *
FROM fruit
`

// Add LIMIT clause.
var queryStar = sql2json(sqlStar)
queryStar.LIMIT = 1

console.log(json2sql(queryStar))
// SELECT *
// FROM fruit
// LIMIT 1
```

Since all fields in a `UNION` must have the same cardinality and data
type, it is necessary to cast all fields to `VARCHAR`. Furthermore the
header could appear not in the first row.
See [this answer on Stack Overflow](http://stackoverflow.com/a/27863648/1217468).
**Know issue*: Casting a boolean to `VARCHAR` could lead to an error (for sure on Redshift):
you would need to know which datatype every filed has, and cast booleans to `INTEGER`.
The statement we need is something like the following

```sql
SELECT foo, bar
FROM (
  SELECT 1 AS i, 'foo' AS foo, 'bar' AS bar
  UNION
  SELECT 2 AS i, foo, bar
  FROM mytable
)
ORDER BY i
```

Assuming that we know the fields involved, the final solution is the
following.

```javascript
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

console.log(json2sql(spool(table, fields)))
// SELECT 'name', 'color', 'quantity', 'when_eat'
// FROM (
//   SELECT 1 AS i, 'name' AS name, 'color' AS color, 'quantity' AS quantity, 'when_eat' AS when_eat
//   UNION
//   SELECT 2 AS i, name::VARCHAR, color::VARCHAR, quantity::VARCHAR, when_eat::VARCHAR
//   FROM fruit
// )
// ORDER BY i
```
