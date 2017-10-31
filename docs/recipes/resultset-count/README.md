---
title: Result set count
permalink: /recipes/resultset-count/
---

# Result set count

[test source](https://github.com/fibo/SQL92-JSON/blob/master/test/recipes/resultset-count.js)

In a report webapp you have calendar filters and drills to configure your
data exploration which will be transalted into an SQL query.

Suppose you want to feedback user with the resultset cardinality, it will
be easy to transform the JSON representing the query to extract data into
a JSON that represents a query that counts how many rows would be returned.

```javascript
function countRows (query) {
  return {
    SELECT: [{ COUNT: '*', AS: 'num_rows' }],
    FROM: [query]
  }
}
```

For instance, consider the following query

```sql
SELECT name
FROM cities
WHERE population > 10000
```

Parse it to JSON format, then add `COUNT` statement and stringify it back to SQL.

```javascript
var sql2json = require('sql92-json').parse
var json2sql = require('sql92-json').stringify

var query = sql2json('SELECT name FROM cities WHERE population > 10000')

console.log(json2sql({
  SELECT: [{ COUNT: '*', AS: 'num_rows' }],
  FROM: [query]
}))
// SELECT COUNT(*) AS num_rows FROM (
//   SELECT name FROM cities WHERE population > 10000
// )
```
