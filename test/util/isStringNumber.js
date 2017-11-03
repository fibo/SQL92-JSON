var test = require('tape')

var isStringNumber = require('util/isStringNumber')

test('isStringNumber', function (t) {
  t.ok(isStringNumber('1'), 'integer')
  t.ok(isStringNumber('1.5'), 'float')
  t.notOk(isStringNumber('1::VARCHAR'), 'casted number')

  t.end()
})
