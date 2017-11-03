var test = require('tape')

var tokensEnclosedByParenthesis = require('util/tokensEnclosedByParenthesis')

test('splitOnOperators', function (t) {
  t.deepEqual(tokensEnclosedByParenthesis(['(', 'a', ')'], 0), ['(', 'a', ')'], 'plain expression')

  t.deepEqual(tokensEnclosedByParenthesis(
    ['(', 'a', ')', 'bla bla'], 0
  ), ['(', 'a', ')'], 'trim expression')

  t.deepEqual(tokensEnclosedByParenthesis(
    ['xxx', '(', 'COUNT', '(', '*', ')', ')', 'xxx'], 0
  ), ['(', 'COUNT', '(', '*', ')', ')'], 'nested expression')

  t.deepEqual(tokensEnclosedByParenthesis(
    ['xxx', '(', 'COUNT', '(', '*', ')', ')', 'xxx'], 2
  ), ['(', '*', ')'], 'nested expression with startIndex')

  t.end()
})
