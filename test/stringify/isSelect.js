var fs = require('fs')
var path = require('path')
var test = require('tape')

var isSelect = require('stringify/isSelect')

var examplesDir = path.join(__dirname, '..', '..', 'examples')

test('isSelect', function (t) {
  fs.readdir(examplesDir, function (err, files) {
    if (err) throw err

    files.forEach(function (file) {
      var extension = path.extname(file)
      var filename = path.parse(file).name

      if ((extension === '.json') && (/^select\./.test(filename))) {
        var jsonFile = path.join(examplesDir, `${filename}.json`)

        fs.readFile(jsonFile, 'utf8', function (err, json) {
          if (err) throw err

          var statement = JSON.parse(json)

          t.ok(isSelect(statement), 'isSelect ' + filename)
        })
      }
    })
  })

  t.end()
})
