const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the MongoDB URI as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nikhil:${password}@cluster0.c1qqpka.mongodb.net/testBlogs?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const initialBlogs = [
    {
        title: "HTML is easy",
        author: "Test Author",
        url: "http://example.com/html-easy",
        likes: 5
    },
    {
        title: "Browser can execute only JavaScript",
        author: "Test Author 2",
        url: "http://example.com/js-execute",
        likes: 3
    }
]

Blog.insertMany(initialBlogs)
    .then(result => {
        console.log('Added initial blogs:', result)
        mongoose.connection.close()
    })
    .catch(error => {
        console.log('Error adding blogs:', error)
        mongoose.connection.close()
    })