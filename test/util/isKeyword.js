var test = require('tape')

var isKeyword = require('src/util/isKeyword')

var isUnion = isKeyword('UNION')

test('isKeyword', function (t) {
  t.ok(isUnion('uNion'), 'UNION')

  t.end()
})
