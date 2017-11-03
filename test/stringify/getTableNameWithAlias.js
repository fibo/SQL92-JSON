var test = require('tape')

var getTableNameWithAlias = require('stringify/getTableNameWithAlias')

test('getTableNameWithAlias', function (t) {
  t.deepEqual(getTableNameWithAlias({ t: 'mytable' }), { t: 'mytable' }, 'table with alias')

  t.deepEqual(getTableNameWithAlias({ AS: { t: 'mytable' } }), { AS: { t: 'mytable' } }, 'table AS alias')

  t.end()
})
