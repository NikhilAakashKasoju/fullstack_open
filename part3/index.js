require("dotenv").config()

const express = require("express")
const morgan = require("morgan")
const app = express()

const Person = require("./models/person")

app.use(express.json())

app.use(express.static("dist"))

morgan.token("body", (request, response) => {
    return JSON.stringify(request.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get("/api/persons", (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get("/info", (request, response) => {
    Person.find({}).then(persons => {

        const total = persons.length
        const date = new Date()
        response.send(
            `<p>Phonebook has info for ${total} people</p>
            <p>${date}</p>`
        )
    })
})

app.get("/api/persons/:id", (request, response) => {

    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
})

app.post("/api/persons", (request, response) => {
    const body = request.body
    /*
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "missing-content"
        })
    }
    */

    Person.findOne({ name: body.name }).then(existingPerson => {
        if (existingPerson) {
            return response.status(404).json({
                error: "name must be unique"
            })
        }

        const person = new Person({
            name: body.name,
            number: body.number,
        })

        person.save().then(p => {
            response.json(p)
        })
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})