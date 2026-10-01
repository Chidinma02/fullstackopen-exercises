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

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
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

