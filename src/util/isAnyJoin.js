var isKeyword = require('./isKeyword')

// TODO outer, inner, full outer join, etc.

function isAnyJoin (token) {
  return (
    isKeyword('JOIN')(token) ||
    isKeyword('LEFT JOIN')(token) ||
    isKeyword('RIGHT JOIN')(token)
  )
}

module.exports = isAnyJoin
