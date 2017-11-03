var fs = require('fs')
var path = require('path')
var test = require('tape')

var isDropTable = require('stringify/isDropTable')

var examplesDir = path.join(__dirname, '..', '..', 'examples')

test('isDropTable', function (t) {
  fs.readdir(examplesDir, function (err, files) {
    if (err) throw err

    files.forEach(function (file) {
      var extension = path.extname(file)
      var filename = path.parse(file).name

      if ((extension === '.json') && (/^drop-table\./.test(filename))) {
        var jsonFile = path.join(examplesDir, `${filename}.json`)

        fs.readFile(jsonFile, 'utf8', function (err, json) {
          if (err) throw err

          var statement = JSON.parse(json)

          t.ok(isDropTable(statement), 'isDropTable ' + filename)
        })
      }
    })
  })

  t.end()
})
