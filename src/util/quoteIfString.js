function quoteIfString (value) {
  if (typeof value === 'string') return "'" + value + "'"
  else return value
}

module.exports = quoteIfString
