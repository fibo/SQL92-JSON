function like (item, operator, string) {
  var comparison = {}

  comparison[operator] = string

  return [item, comparison]
}

module.exports = like
