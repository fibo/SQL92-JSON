var getResultSetAlias = require('./getResultSetAlias')
var isKeyword = require('../util/isKeyword')
var isAs = isKeyword('AS')

/**
 * Extract result set with alias.
 *
 * { t: { SELECT: ['foo'], FROM: ['mytable']} , JOIN: {} } => { t: { SELECT: ['foo'], FROM: ['mytable'] } }
 * { AS: { t: { SELECT: ['foo'], FROM: ['mytable'] } }, JOIN: {} } => { AS: { t: { SELECT: ['foo'], FROM: ['mytable'] } } }
 *
 * @param {Object} json
 *
 * @returns {Object|undefined}
 */

function getResultSetWithAlias (json) {
  var keys = Object.keys(json)
  var resultSetObj
  var resultSet

  var alias = getResultSetAlias(json)

  if (alias) {
    resultSetObj = {}
    resultSet = json[alias]
    resultSetObj[alias] = resultSet
  } else {
    for (var i = 0; i < keys.length; i++) {
      var token = keys[i]

      if (isAs(token)) {
        alias = getResultSetAlias(json[token])

        if (alias) {
          resultSetObj = { AS: json[token] }
          break
        } else {
          return
        }
      }
    }
  }

  return resultSetObj
}

module.exports = getResultSetWithAlias
