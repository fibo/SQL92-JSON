var isKeyword = require('../util/isKeyword')
var isSelect = require('./isSelect')

/**
 * Extract result set alias, and check that result set is a SELECT.
 *
 * { t: { SELECT: ['foo'], FROM ['mytable'] } } => t
 *
 * @param {Object} json
 *
 * @returns {String|undefined} alias
 */

function getResultSetAlias (json) {
  var keys = Object.keys(json)
  var resultSet

  for (var i = 0; i < keys.length; i++) {
    var token = keys[i]

    if (isKeyword()(token)) continue

    resultSet = json[token]

    if (isSelect(resultSet)) {
      return token
    } else {
      return
    }
  }
}

module.exports = getResultSetAlias
