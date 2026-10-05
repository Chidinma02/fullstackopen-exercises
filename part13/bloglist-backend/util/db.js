const Sequelize = require('sequelize')
const { DATABASE_URL, TEST_DATABASE_URL, TESTING } = require('./config')

const dbUrl =
  process.env.TESTING === 'true' || TESTING === 'true'
    ? process.env.TEST_DATABASE_URL || TEST_DATABASE_URL
    : DATABASE_URL

const isLocalhost =
  !dbUrl ||
  dbUrl.includes('localhost') ||
  dbUrl.includes('127.0.0.1')

const dialectOptions = !isLocalhost
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : {}

const sequelize = new Sequelize(dbUrl, {
  dialectOptions
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
