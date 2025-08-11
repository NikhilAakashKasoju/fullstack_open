require("dotenv").config()

const express = require("express")
const app = express()
app.use(express.json())
app.use(express.static("dist"))

const Person = require("./models/person")

const morgan = require("morgan")

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

morgan.token("body", (request, response) => {
    return JSON.stringify(request.body)
})

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

app.get("/api/persons/:id", (request, response, next) => {

    Person.findById(request.params.id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

//app.post("/api/persons", (request, response, next) => {

/*
const body = request.body

*/

app.post("/api/persons", (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: "missing-content"
        })
    }

    Person.findOne({ name: body.name })
        .then(existingPerson => {
            if (existingPerson) {
                return response.status(400).json({
                    error: "name must be unique"
                })
            }

            const person = new Person({
                name: body.name,
                number: body.number,
            })
            return person.save()
                .then(savedPerson => {
                    if (savedPerson) {
                        response.json(savedPerson)
                    }
                }).catch(error => next(error))
        })
        .catch(error => next(error))
})


app.put("/api/persons/:id", (request, response, next) => {
    console.log("put running")
    const name = request.body.name
    const number = request.body.number

    if (!name || !number) {
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    Person.findByIdAndUpdate(request.params.id, {
        name: name,
        number: number

    },
        {
            new: true,
            runValidators: true,
            context: "query"
        })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(400).json({ error: "person not found" })
            }
        })
        .catch(error => next(error))
})

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            if (result) {
                response.status(200).end()
            } else {
                response.status(400).send({ error: "person not found" })
            }
        }).catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`)
})