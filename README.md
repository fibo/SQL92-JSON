# SQL92-JSON

> can stringify a JSON into an SQL

[Installation](#installation) |
[Usage](#usage) |
[License](#license)

[![NPM version](https://badge.fury.io/js/sql92-json.svg)](http://badge.fury.io/js/sql92-json) [![Build Status](https://travis-ci.org/fibo/SQL92-JSON.svg?branch=master)](https://travis-ci.org/fibo/SQL92-JSON?branch=master) [![Dependency Status](https://gemnasium.com/fibo/static-props.svg)](https://gemnasium.com/fibo/static-props)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

## Installation

With [npm](https://npmjs.org/) do

```bash
npm install sql92-json
```

## Usage

> Convert a JSON to SQL

```javascript
var json2sql = require('sql92-json').stringify

console.log(json2sql({  //
  SELECT: ['*'],        // SELECT *
  FROM: ['revenue']     // FROM revenue
}))                     //
```

See [examples] folder where every `.json` file has its homonym `.sql`.

See for example the following [example JSON][exampleJSON] and its [corresponding SQL][exampleSQL].

```json
{
  "SELECT": ["*"],
  "FROM": ["mytable"],
  "WHERE": [
    "yyyymmdd", { "=": 20170101 },
    { "AND": [ "country", { "IN": ["IT", "US"] } ] }
  ]
}
```

```sql
SELECT *
FROM mytable
WHERE yyyymmdd = 20170101
	AND country IN ( 'IT', 'US' )
```

## License

[MIT](http://g14n.info/mit-license/)

[examples]: https://github.com/fibo/SQL92-JSON/tree/master/examples
[exampleSQL]: https://github.com/fibo/SQL92-JSON/blob/master/examples/_readme.select.sql
[exampleJSON]: https://github.com/fibo/SQL92-JSON/blob/master/examples/_readme.select.json
