
var test = require('tape')

var countTokens = require('src/util/countTokens')

test('countTokens', function (t) {
  t.equal(countTokens('string'), 1)
  t.equal(countTokens(5), 1)
  t.equal(countTokens([
    'c.id', { '=': 't.campaignid' }
  ]), 3)

  t.end()
})
