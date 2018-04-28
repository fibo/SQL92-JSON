var isKeyword = require('./isKeyword')

var isExcept = isKeyword('EXCEPT')
var isIntersect = isKeyword('INTERSECT')
var isUnion = isKeyword('UNION')
var isUnionAll = isKeyword('UNION ALL')

function isSetOperator (token) {
  return (isExcept(token) || isIntersect(token) || isUnion(token) || isUnionAll(token))
}

module.exports = isSetOperator
