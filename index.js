const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

const Person = require('./models/persons')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body))

const loggerformat =':method :url :status :res[content-length] :response-time ms :body'
app.use(morgan(loggerformat))
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('build'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '19329'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '137373737739'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '19323327732782329'
  },
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then( person => {
    response.json(person.toJSON())
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }



  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  }).catch(error => {
    console.log(error.message)
    response.status(400).json({
      error: error.message
    })
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
}

)

app.get('/info', (request, response) => {
  const numOfPeople = persons.length
  const date = new Date()
  response.send(`Phone book has info for ${numOfPeople} <p>${date}</p>`)
})


const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)