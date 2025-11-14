const jwt = require('jsonwebtoken')
const User = require('../models/user')

// Middleware to extract token from Authorization header
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

// Middleware to extract user from token
const userExtractor = async (request, response, next) => {
  if (request.token) {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
      request.user = await User.findById(decodedToken.id)
    } catch (error) {
      return response.status(401).json({ error: 'token invalid' })
    }
  } else {
    request.user = null
  }
  next()
}

// Middleware for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Middleware for error handling
const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

module.exports = { tokenExtractor, userExtractor, unknownEndpoint, errorHandler }
