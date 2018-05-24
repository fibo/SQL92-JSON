const tokenizer = require('sql-tokenizer')

const tokenize = tokenizer()

/**
 * Convert SQL to JSON.
 *
 * @param {String} sql
 *
 * @returns {Object} json
 */

function parse (sql) {
  const tokens = tokenize(sql)

  const statement = tokens.reduce((json, token, index, tokens) => {
    switch (token.toUpperCase()) {
      case 'SELECT':
        json.type = 'select statement'

        json.data = json.data.concat(selectStatementData(tokens.slice(index)))

      default: return json
    }
  }, {
    type: 'unknown',
    data: []
  })

  return [statement]
}

module.exports = parse

function isNotCode (token) {
  const firstCharacter = token[0]

  const isDashComment = token.substring(0, 2) === '--'

  const isStarComment = (
    (token.substring(0, 2) === '/*') &&
    (token.substring(token.length - 2, token.length) === '*/')
  )

  const isWhiteSpace = (firstCharacter === ' ') || (firstCharacter === '\t')

  return isDashComment || isStarComment || isWhiteSpace
}

const numTokens = ({ data, code }) => {
  if (data) {
    return data.reduce((sum, item) => (sum + numTokens(item)), 0)
  }

  if (code) {
    return code.length
  }
}

function selectStatementData (tokens) {
  let data = []

  let foundSelect = false
  let parsedSelectList = false

  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    const TOKEN = token.toUpperCase()

    switch (true) {
      case TOKEN === 'SELECT':
        const select = {
          type: 'select keyword',
          code: keywordCode(tokens.slice(index))
        }

        index += numTokens(select) - 1

        data.push(select)

        foundSelect = true

        break
      case (foundSelect && !parsedSelectList):
        const selectList = {
          type: 'select list',
          data: selectListData(tokens.slice(index))
        }

        index += numTokens(selectList) - 1

        data.push(selectList)

        parsedSelectList = true

        break
      case TOKEN === 'FROM':
        const from = {
          type: 'from keyword',
          code: keywordCode(tokens.slice(index))
        }

        index += numTokens(from) - 1

        data.push(from)

        break
      default:
        data.push({
            type: 'unknown',
            code: [ token ]
        })
    }
  }

  return data
}

function selectListData (tokens) {
  return [
    {
      "type": "derived column",
      "code": [ 1, "\n" ]
    }
  ]
}

function keywordCode (tokens) {
  let code = []
  let otherCodeFound = false

  tokens.forEach((token, index) => {
    if (otherCodeFound) return

    // First token should be keyword itself.
    if (index === 0) {
      code.push(token)
    } else {
      if (isNotCode(token)) {
        code.push(token)
      } else {
        otherCodeFound = true
      }
    }
  })

  return code
}
