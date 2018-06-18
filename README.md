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
[![Coverage Status](https://coveralls.io/repos/fibo/SQL92-JSON/badge.svg?branch=master)](https://coveralls.io/r/fibo/SQL92-JSON?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Demo](//g14n.info/SQL92-JSON/demo.png)](//g14n.info/SQL92-JSON/demo)

## Installation

### Using npm

With [npm](https://npmjs.org/) do

```bash
npm install sql92-json
```

### Using a CDN

Add this to your HTML page

```html
<script src="https://unpkg.com/sql92-json/dist/sql92-json.min.js"></script>
```

## API

Both CommonJS and ES6 imports are supported. Code snippets below use
`require`, it is also possible to do

```javascript
import { parse, stringify } from 'sql92-json'
```

### `stringify`

> Convert a JSON to SQL

Both `require('sql92-json').stringify` and `require('sql92-json/stringify')` are valid.

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

Both `require('sql92-json').parse` and `require('sql92-json/parse')` are valid.

```javascript
var sql2json = require('sql92-json').parse

console.log(sql2json('SELECT * FROM revenue')
// {
//   SELECT: ['*'],
//   FROM: ['revenue']
// }
```

## Recipes

* [Add resultset limit](http://g14n.info/SQL92-JSON/recipes/resultset-limit/) (WiP)
* [Compute resultset count](http://g14n.info/SQL92-JSON/recipes/resultset-count/)
* [Prepend pool header](http://g14n.info/SQL92-JSON/recipes/spool-header/)
* [Table list](http://g14n.info/SQL92-JSON/recipes/table-list/) (PoC)

## Examples

See [examples] folder where every `.json` file has its homonym `.sql`.

See for example the following [example JSON][exampleJSON] and its [corresponding SQL][exampleSQL].

```json
{
  "SELECT": [ { "COUNT": "*", "AS": "num" } ],
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
