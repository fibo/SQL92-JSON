function maybeQuote (value) {
  if (typeof value === 'string') return "'" + value + "'"
  else return value
}

var isArray = Array.isArray

/**
 * Extract WHERE filter.
 *
 * @param {Object} filter
 *
 * @returns {String} result
 */

function whereFilter (filter) {
  if (filter['=']) return '= ' + maybeQuote(filter['='])
  if (filter['>']) return '> ' + maybeQuote(filter['>'])
  if (filter['<']) return '< ' + maybeQuote(filter['<'])

  if (isArray(filter.IN)) return 'IN (' + filter.IN.map(maybeQuote).join(', ') + ')'

  if (isArray(filter.AND)) {
    if (filter.AND.length === 2) {
      return 'AND ' + filter.AND[0] + ' ' + whereFilter(filter.AND[1])
    } else {
      var andResult = ''
      return 'AND (' + andResult + ')'
    }
  }

  if (isArray(filter.OR)) {
    if (filter.OR.length === 2) {
      return 'OR ' + whereFilter(filter.OR)
    } else {
      return 'OR (' + whereFilter(filter.OR) + ')'
    }
  }
}

module.exports = whereFilter
