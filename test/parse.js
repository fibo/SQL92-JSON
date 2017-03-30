var fs = require('fs')
var path = require('path')
var test = require('tape')

var sql2json = require('sql92-json').parse

var examplesDir = path.join(__dirname, '..', 'examples')

test('examples', function (t) {
  var sqlFile1 = path.join(examplesDir, 'select.0001.sql')
  var jsonFile1 = path.join(examplesDir, 'select.0001.json')

  fs.readFile(sqlFile1, 'utf8', function (err, statement) {
    if (err) throw err

    var result = sql2json(statement)
    var expected = require(jsonFile1)

    t.deepEqual(result, expected)
  })

  t.end()
})
