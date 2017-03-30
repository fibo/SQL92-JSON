function isStringNumber (value) {
  return !isNaN(parseFloat(value))
}

module.exports = isStringNumber
