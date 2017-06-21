var test = require('tape')

var orderByCondition = require('src/stringify/orderByCondition')

test('orderByCondition', function (t) {
  t.equal(orderByCondition(1), 1, 'ORDER BY 1')
  t.equal(orderByCondition({ DESC: 1 }), '1 DESC', 'ORDER BY 1 DESC')

  t.end()
})
