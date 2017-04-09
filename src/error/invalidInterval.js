function errorInterval (left, right) {
  var message = 'invalid interval'
  if (left || right) message += ':'
  if (left) message += ' ' + left
  if (right) message += ' ' + right

  var error = new Error(message)
  error.left = left
  error.right = right

  return error
}

module.exports = errorInterval
