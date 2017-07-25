var test = require('tape')

var nvlExpression = require('src/stringify/nvlExpression')

test('nvlExpression', function (t) {
  t.equal(nvlExpression({ NVL: [ 'click', 0 ] }), 'NVL(click, 0)', 'NVL')
  t.equal(nvlExpression({ AS: 'click', NVL: [ 'click', 0 ] }), 'NVL(click, 0) AS click', 'NVL with alias')

  t.end()
})
