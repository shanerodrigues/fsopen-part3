const express = require("express")
const res = require("express/lib/response")
const app = express()
const morgan = require("morgan")
const cors = require("cors")

app.use(express.json())
app.use(cors())

morgan.token("personInfo", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :personInfo"
  )
)

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/api/persons", (request, response) => {
  response.json(persons)
})

app.get("/info", (request, response) => {
  const peopleNum = persons.length
  const date = new Date()
  const text = `Phonebook has info for ${peopleNum} people\
   ${date}`
  response.json(text)
})

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete("/api/persons/:id", (request, response) => {
  const people = persons.length
  const id = Number(request.params.id)

  if (id > people) {
    response.status(404).end()
  } else {
    persons = persons.filter((person) => person.id !== id)
    response.status(204).end()
  }
})

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0
  return maxId + 1
}

app.post("/api/persons", (request, response) => {
  const body = request.body

  if (body.name) {
    const name = persons.find((person) => person.name === body.name)
    if (name) {
      return response.status(400).json({
        error: "name must be unique",
      })
    }
  }
  if (!body.name) {
    return response.status(400).json({
      error: "Name is missing",
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: "Number is missing",
    })
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  response.json(person)
})

// function assignObj(req, res, next, person) {
//   req.name = person.name
//   req.number = person.number
//   next()
// }

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
