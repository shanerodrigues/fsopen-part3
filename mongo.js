const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  )
  process.exit(1)
}

const password = process.argv[2]
const nameInput = process.argv[3]
const numberInput = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.or3ck.mongodb.net/phonebook-fullstackapp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
  name: nameInput,
  number: numberInput,
})

if (process.argv.length > 3) {
  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person.find({ important: true }).then((result) => {
    console.log("phonebook:")
    result.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}
