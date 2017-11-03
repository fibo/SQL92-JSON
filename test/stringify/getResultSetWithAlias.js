var test = require('tape')

var getResultSetWithAlias = require('stringify/getResultSetWithAlias')

test('getResultSetWithAlias', function (t) {
  t.deepEqual(getResultSetWithAlias({ t: { SELECT: ['foo'], FROM: ['mytable'] } }), { t: { SELECT: ['foo'], FROM: ['mytable'] } }, 'result set with alias')

  t.deepEqual(getResultSetWithAlias({ AS: { t: { SELECT: ['foo'], FROM: ['mytable'] } } }), { AS: { t: { SELECT: ['foo'], FROM: ['mytable'] } } }, 'result set AS alias')

  t.end()
})
