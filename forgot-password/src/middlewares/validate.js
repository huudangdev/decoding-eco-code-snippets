const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const error = {}
    errors.array().map(function (err) { error[err.param] = err.msg })
    return res.status(422).json({ error })
  }

  next()
}
