const fs = require('fs')
const path = require('path')
const test = require('tape')

const json2sql = require('sql92-json').stringify

const examplesDir = path.join(__dirname, '..', 'examples')

test('stringify', function (t) {
  fs.readdir(examplesDir, function (err, files) {
    if (err) throw err

    files.forEach(function (file) {
      const extension = path.extname(file)
      const filename = path.parse(file).name

      if (extension === '.json') {
        const jsonFile = path.join(examplesDir, `${filename}${extension}`)
        const sqlFile = path.join(examplesDir, `${filename}.sql`)

        fs.readFile(sqlFile, 'utf8', function (err, expected) {
          if (err) throw err

          const result = json2sql(require(jsonFile))

          t.equal(result, expected, 'stringify ' + filename)
        })
      }
    })
  })

  t.end()
})
