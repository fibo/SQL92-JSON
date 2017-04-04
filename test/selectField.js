var test = require('tape')

var selectField = require('../src/selectField')

test('selectField', function (t) {
  t.equal(selectField('field'), 'field', 'common field')
  t.equal(selectField('*'), '*', 'star')
  t.equal(selectField(1), 1, 'integer')
  t.equal(selectField(1.5), 1.5, 'float')
  t.equal(selectField({ COUNT: '*' }), 'COUNT(*)', 'COUNT')
  t.equal(selectField('1::VARCHAR'), '1::VARCHAR', 'cast')

  t.end()
})
