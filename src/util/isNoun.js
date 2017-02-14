function isNoun (field) {
  return /^[a-zA-Z_][a-zA-Z_0-9]+$/.test(field)
}

module.exports = isNoun
