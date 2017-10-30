var test = require('tape')

var isKeyword = require('src/util/isKeyword')

var isJoin = isKeyword('JOIN')
var isUnion = isKeyword('UNION')

test('isKeyword', function (t) {
  t.ok(isUnion('uNion'), 'case insensitive')
  t.notOk(isUnion(), 'undefined is not a keyword')

  t.ok(isJoin('join'), 'join')

  t.end()
})
