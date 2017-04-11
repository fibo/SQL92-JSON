var isCastedValue = require('./isCastedValue')

function isStringNumber (value) {
  // Handle values like 1::VARCHAR which could be parsed as 1 by parseFloat.
  if (isCastedValue(value)) return false

  return !isNaN(parseFloat(value))
}

module.exports = isStringNumber
