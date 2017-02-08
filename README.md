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

console.log(json2sql({SELECT: ['*'], FROM: ['revenue']}))
// SELECT *
// FROM revenue
//
```

See [examples] folder.

## License

[MIT](http://g14n.info/mit-license/)

[examples]: https://github.com/fibo/SQL92-JSON/tree/master/examples
