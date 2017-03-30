var test = require('tape')

var isFunction = require('../src/util/isFunction')

test('isFunction', function (t) {
  t.ok(isFunction('COUNT'), 'COUNT')
  t.ok(isFunction('counT'), 'COUNT case insensitive')

  t.end()
})
