const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const isLocalhost =
  !DATABASE_URL ||
  DATABASE_URL.includes('localhost') ||
  DATABASE_URL.includes('127.0.0.1')

const dialectOptions = !isLocalhost
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : {}

const sequelize = new Sequelize(DATABASE_URL, {
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
