const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.json()) // Parse JSON bodies

app.use(express.static('dist'))
// 3.8: Create custom token to log POST body
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

const cors = require('cors')
app.use(cors())


// 3.7 & 3.8: Use morgan middleware
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
  { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
]

// 3.1: Get all persons
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// 3.2: Info page
app.get('/info', (req, res) => {
  const total = persons.length
  const date = new Date()
  res.send(`
    <p>Phonebook has info for ${total} people</p>
    <p>${date}</p>
  `)
})

// 3.3: Get single person
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).json({ error: 'Person not found' })
  }
})

// 3.4: Delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).end()
})

// Helper function for generating ID
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0
  return maxId + 1
}

// 3.5 & 3.6: Add new person
app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({ error: 'Name or number missing' })
  }

  const nameExists = persons.some(p => p.name === body.name)
  if (nameExists) {
    return res.status(400).json({ error: 'Name must be unique' })
  }

  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  res.json(newPerson)
})

// Start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
