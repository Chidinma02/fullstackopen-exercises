require('dotenv').config()
const mongoose = require('mongoose')

const name = process.argv[2]
const number = process.argv[3]

if (process.argv.length === 0) {
  Person.find({})
    .then(result => {
      console.log('phonebook:')
      result.forEach(p => console.log(`${p.name} ${p.number}`))
    })
    .catch(err => console.error('Error fetching persons:', err))
    .finally(() => mongoose.connection.close())
}

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// If no extra arguments → list all persons
if (process.argv.length === 2) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

// If name and number provided → add a new person
else if (process.argv.length === 4) {
  const person = new Person({
    name,
    number,
  })

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}

// Otherwise → wrong number of arguments
else {
  console.log('Please provide both a name and a number, or leave both out to list entries.')
  mongoose.connection.close()
}
