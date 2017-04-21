# SQL92-JSON

> can stringify a JSON into an SQL and viceversa parse an SQL and serialize it into a JSON

🚧 **STATUS**: Right now the test suite contains 32 SELECT statements that
are serialized into JSON and viceversa parsed back into SQL successfully.
Adding INSERT and other DMLs statementes as well as DDLs is on the roadmap.

[Installation](#installation) |
[API](#api) |
[Examples](#examples) |
[Recipes](#recipes) |
[References](#references) |
[License](#license)

[![NPM version](https://badge.fury.io/js/sql92-json.svg)](http://badge.fury.io/js/sql92-json)
[![Build Status](https://travis-ci.org/fibo/SQL92-JSON.svg?branch=master)](https://travis-ci.org/fibo/SQL92-JSON?branch=master)
[![Dependency Status](https://gemnasium.com/fibo/static-props.svg)](https://gemnasium.com/fibo/static-props)
[![Coverage Status](https://coveralls.io/repos/fibo/SQL92-JSON/badge.svg?branch=master)](https://coveralls.io/r/fibo/SQL92-JSON?branch=master)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

With [npm](https://npmjs.org/) do

```bash
npm install sql92-json
```

## API

### `stringify`

> Convert a JSON to SQL

```javascript
var json2sql = require('sql92-json').stringify

console.log(json2sql({  //
  SELECT: ['*'],        // SELECT *
  FROM: ['revenue']     // FROM revenue
}))                     //
```

### `parse`

> Convert an SQL to JSON

```javascript
var sql2json = require('sql92-json').parse

console.log(sql2json(`
SELECT *
FROM revenue
`)                      // {
                        //   SELECT: ['*'],
                        //   FROM: ['revenue']
                        // }
```

## Recipes

* [Spool header](g14n.info/SQL92-JSON/recipes/spool-header/)

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

[sql1992.txt](./sql1992.txt) was downloaded from http://www.contrib.andrew.cmu.edu/~shadow/sql/sql1992.txt

## License

[MIT](http://g14n.info/mit-license/)

[examples]: https://github.com/fibo/SQL92-JSON/tree/master/examples
[exampleSQL]: https://github.com/fibo/SQL92-JSON/blob/master/examples/_readme.select.sql
[exampleJSON]: https://github.com/fibo/SQL92-JSON/blob/master/examples/_readme.select.json
