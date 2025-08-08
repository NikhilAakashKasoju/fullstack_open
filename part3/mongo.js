const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("give password as an argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nikhil:${password}@cluster0.cfpq3ev.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log("Phonebook: ")
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        //console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    console.log("usage")
    console.log("To add: node mongo.js <password> <name> <number>")
    console.log("To list: node mongo.js <password>")
    mongoose.connection.close()
}
