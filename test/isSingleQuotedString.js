var test = require('tape')

var isSingleQuotedString = require('../src/util/isSingleQuotedString')

test('isSingleQuotedString', function (t) {
  t.ok(isSingleQuotedString("'string'"), 'string')
  t.ok(isSingleQuotedString("'string with spaces'"), 'string with spaces')

  t.end()
})
