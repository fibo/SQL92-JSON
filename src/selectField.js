var isAlias = require('./isAlias')
var isNoun = require('./util/isNoun')
var isNumber = require('./util/isNumber')
var isObject = require('./util/isObject')
var isStar = require('./util/isStar')
var isString = require('./util/isString')

/**
 * Extract WHERE conditions.
 *
 * @param {*} field
 *
 * @returns {String} result
 */

function selectField (field) {
  var aliasName

  if (isStar(field)) return field

  if (isNumber(field)) return field

  if (isString(field) && isNoun(field)) return field

  if (isObject(field)) {
    var count = field.COUNT

    if (count) {
      if (isAlias(field)) {
        aliasName = field.AS

        if (isStar(count)) return 'COUNT(*) AS ' + aliasName
        if (count === 1) return 'COUNT(1) AS ' + aliasName
      } else {
        if (isStar(count)) return 'COUNT(*)'
        if (count === 1) return 'COUNT(1)'
      }
    }
  }
}

module.exports = selectField
