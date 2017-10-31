---
title: sql92-json
---
# SQL92-JSON

> can stringify a JSON into a SQL and viceversa parse a SQL statement and serialize it into a JSON

[Installation](#installation) |
[API](#api) |
[Examples](#examples) |
[Recipes](#recipes) |
[References](#references) |
[License](#license)

[![NPM version](https://badge.fury.io/js/sql92-json.svg)](http://badge.fury.io/js/sql92-json)
[![Build Status](https://travis-ci.org/fibo/SQL92-JSON.svg?branch=master)](https://travis-ci.org/fibo/SQL92-JSON?branch=master)
[![Badge size](https://badge-size.herokuapp.com/fibo/sql92-json/master/dist/sql92-json.min.js)](https://github.com/fibo/sql92-json/blob/master/dist/sql92-json.min.js)
[![Dependency Status](https://gemnasium.com/fibo/SQL92-JSON.svg)](https://gemnasium.com/fibo/SQL92-JSON)
[![Coverage Status](https://coveralls.io/repos/fibo/SQL92-JSON/badge.svg?branch=master)](https://coveralls.io/r/fibo/SQL92-JSON?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Demo](http://g14n.info/SQL92-JSON/demo.png)](http://g14n.info/SQL92-JSON/demo)

🚧 **STATUS**: Right now the test suite contains many SELECT statements (and few CREATEs) that are serialized into JSON and viceversa parsed back into SQL successfully.
Adding INSERT and other DMLs statements as well as DDLs is on the roadmap.
Sub queries are supported.
The following keywords are already implemented and tested:

> `SELECT` `COUNT` `FROM` `GROUP BY` `ORDER BY` `UNION` `UNION ALL`
> `AND` `OR` `JOIN` `AS` `HAVING` `LEFT JOIN` `WHERE` `BETWEEN` `NOT BETWEEN` `IN`
> `MIN` `MAX` `AVG` `SUM` `DISTINCT` `LIMIT` `OFFSET` `DESC` `ASC`, `NVL`
> `LIKE` `NOT LIKE`

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```bash
npm install sql92-json
```

### Using a CDN

Adding this to your HTML page

```html
<script src="https://unpkg.com/sql92-json/dist/sql92-json.min.js"></script>
```

## API

### `stringify`

> Convert a JSON to SQL

```javascript
var json2sql = require('sql92-json').stringify

console.log(json2sql({ SELECT: ['*'], FROM: ['revenue'] }))
//
// SELECT *
// FROM revenue
//
```

### `parse`

> Convert an SQL to JSON

```javascript
var sql2json = require('sql92-json').parse

console.log(sql2json('SELECT * FROM revenue')
// {
//   SELECT: ['*'],
//   FROM: ['revenue']
// }
```

## Recipes

* [Spool header](http://g14n.info/SQL92-JSON/recipes/spool-header/)
* [Resultset count](http://g14n.info/SQL92-JSON/recipes/resultset-count/)

## Examples

See [examples] folder where every `.json` file has its homonym `.sql`.

See for example the following [example JSON][exampleJSON] and its [corresponding SQL][exampleSQL].

```json
{
  "SELECT": [
    { "COUNT": "*", "AS": "num" }
  ],
  "FROM": [
    {
      "SELECT": ["*"],
      "FROM": ["mytable"],
      "WHERE": [
        "yyyymmdd", { "=": 20170101 },
        { "AND": [ "country", { "IN": ["IT", "US"] } ] },
        { "AND": [
          "categoryid", { "BETWEEN": [100, 200] },
          { "OR": [ "productname", { "!=": "'icecream'" } ] }
        ] }
      ]
    }
  ]
}
```

```sql
SELECT COUNT(*) AS num
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
```

## References

[sql1992.txt](https://github.com/fibo/SQL92-JSON/blob/master/sql1992.txt) was downloaded from [here](http://www.contrib.andrew.cmu.edu/~shadow/sql/sql1992.txt).

## License

[MIT](http://g14n.info/mit-license/)

[examples]: https://github.com/fibo/SQL92-JSON/tree/master/examples
[exampleSQL]: https://github.com/fibo/SQL92-JSON/blob/master/examples/_readme.select.sql
[exampleJSON]: https://github.com/fibo/SQL92-JSON/blob/master/examples/_readme.select.json
