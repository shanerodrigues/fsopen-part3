const express = require("express")
const res = require("express/lib/response")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
require("dotenv").config()
const Person = require("./models/person")
const mongoose = require("mongoose")

app.use(express.json())
app.use(cors())
app.use(express.static("build"))

morgan.token("personInfo", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :personInfo"
  )
)

// GET ALL PERSONS
app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

// GET SINGLE PERSON
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

// POST NEW PERSON
app.post("/api/persons", (request, response, next) => {
  const body = request.body

  // if (body.name === undefined) {
  //   return response.status(400).json({ error: "content missing" })
  // }
  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson)
    })
    .catch((error) => next(error))
})

// DELETE PERSON
app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

// UPDATE PERSON
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body

  const person = {
    person: body.person,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

//INFO
app.get("/info", (request, response) => {
  const date = new Date()
  Person.countDocuments({}, function (err, c) {
    const text = `Phonebook has info for ${c} people\
    ${date}`
    response.json(text)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  } else if (error.name === "BadRequest") {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

//this has to be last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
