var fs = require('fs')
var path = require('path')
var test = require('tape')

var sql2json = require('sql92-json').parse

var examplesDir = path.join(__dirname, '..', 'examples')

test('parse', function (t) {
  fs.readdir(examplesDir, function (err, files) {
    if (err) throw err

    files.forEach(function (file) {
      var extension = path.extname(file)
      var filename = path.parse(file).name

      // TODO Restrict tests by now, until completion.
      if (filename > 'select.0020') return
      if (filename === '_readme.select') return

      if (extension === '.sql') {
        var jsonFile = path.join(examplesDir, `${filename}.json`)
        var sqlFile = path.join(examplesDir, `${filename}${extension}`)

        fs.readFile(sqlFile, 'utf8', function (err, statement) {
          if (err) throw err

          var result = sql2json(statement)
          var expected = require(jsonFile)

          t.deepEqual(result, expected)
        })
      }
    })
  })

  t.end()
})
