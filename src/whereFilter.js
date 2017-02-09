/**
 * Extract WHERE filter.
 *
 * @param {Object} filter
 *
 * @returns {String} result
 */

function whereFilter (filter) {
  if (filter['=']) return '= ' + filter['=']
  if (filter['>']) return '> ' + filter['>']
  if (filter['<']) return '< ' + filter['<']

  if (filter.AND) {
    if (Array.isArray(filter.AND)) {
      return '(' + whereFilter(filter.AND) + ')'
    } else {
      return whereFilter(filter.AND)
    }
  }

  if (filter.OR) {
    if (Array.isArray(filter.OR)) {
      return '(' + whereFilter(filter.OR) + ')'
    } else {
      return whereFilter(filter.OR)
    }
  }
}

module.exports = whereFilter
