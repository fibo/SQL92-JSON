var sqlTokenizer = require('sql-tokenizer')

/**
r* Analyze SQL and convert it into a list of tokens.
 *
 * @param {String} sql
 *
 * @returns {Array} tokens
 */

function tokenize (sql) {
  var tokens = sqlTokenizer()(sql)

  return tokens
}

module.exports = tokenize
