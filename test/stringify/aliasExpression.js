var test = require('tape')

var aliasExpression = require('src/stringify/aliasExpression')
var select = require('src/stringify/select')

test('minExpression', function (t) {
  t.equal(aliasExpression({ }), '', 'no alias')
  t.equal(aliasExpression({ AS: 'myalias' }), ' AS myalias', 'simple alias')
  t.equal(aliasExpression({ AS: 'my count' }), ' AS "my count"', 'alias with space')
  t.equal(aliasExpression({ AS: { num: 1 } }), '1 AS num', 'alias expression')
  t.equal(aliasExpression({ AS: { num: { SELECT: ['foo'], FROM: ['mytable'] } } }, select), '(SELECT foo FROM mytable) AS num', 'sub query with alias')

  t.end()
})
