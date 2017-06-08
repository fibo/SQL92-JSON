var isAnyJoin = require('../util/isAnyJoin')

function getJoinKeyword (statement) {
  var keys = Object.keys(statement)

  for (var i = 0; i < keys.length; i++) {
    var token = keys[i]

    if (isAnyJoin(token)) return token
  }
}

module.exports = getJoinKeyword
