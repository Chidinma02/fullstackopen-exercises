const config = require('./utils/config')
const express = require('express')
const app = express()
require('express-async-errors')
const cors = require('cors')
const mongoose = require('mongoose')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

if (process.env.NODE_ENV === 'test') {
  const { MongoMemoryServer } = require('mongodb-memory-server')
  MongoMemoryServer.create().then(mongod => {
    const uri = mongod.getUri()
    mongoose.connect(uri)
  })
} else {
  mongoose.connect(config.MONGODB_URI)
}

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
