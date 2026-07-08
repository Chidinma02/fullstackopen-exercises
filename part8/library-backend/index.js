const { ApolloServer } = require("@apollo/server")
const { expressMiddleware } = require('@as-integrations/express5')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const express = require('express')
const { createServer } = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/user')

mongoose.set('strictQuery', false)

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = require('./schema')
const resolvers = require('./resolvers')

const start = async () => {
  const app = express()
  const httpServer = createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7), process.env.JWT_SECRET
            )
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            return {}
          }
        }
        return {}
      },
    })
  )

  const PORT = 4000

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`)
  })
}

start()
