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

const { Umzug, SequelizeStorage } = require('umzug')

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}
const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }
