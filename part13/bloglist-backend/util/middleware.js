const jwt = require('jsonwebtoken')
const { SECRET } = require('./config')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({
      error: error.errors ? error.errors.map(e => e.message) : [error.message]
    })
  } else if (error.name === 'SequelizeDatabaseError') {
    return response.status(400).json({ error: [error.message] })
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: ['malformatted id'] })
  }

  return response.status(400).json({ error: [error.message] })
}

const { Session, User } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)

      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'session expired or invalid' })
      }

      const user = await User.findByPk(req.decodedToken.id)
      if (!user || user.disabled) {
        return res.status(401).json({ error: 'account disabled, please contact admin' })
      }

    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}

