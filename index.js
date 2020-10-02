const { request, response } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');



const app = express();

morgan.token('body', (req, res) => JSON.stringify(req.body));

const loggerformat =':method :url :status :res[content-length] :response-time ms :body';
app.use(morgan(loggerformat));
app.use(express.json());
app.use(cors());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "19329"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "137373737739"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "19323327732782329"
  },
]

app.get('/api/persons', (request, response) => {
  response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person);
  }
  else {
    response.status(404).end()
  }

  response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000000));
}

function checkIfNameExists(responseName){
  let exists = false;
  for(const person of persons){
    if(person.name === responseName){
      exists = true;
    }
  }
  return exists;
}
  
app.post('/api/persons', (request, respone) => {
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

  if(checkIfNameExists(body.name)){
    return response.status(400).json({ 
      error: 'That name already exists' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
  persons = persons.concat(person)
  respone.json(person);
})

app.get('/info', (request, response) => {
  const numOfPeople = persons.length
  const date = new Date();
  response.send(`Phone book has info for ${numOfPeople} <p>${date}</p>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)