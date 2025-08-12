const blogsRouter = require("express").Router()

const Blog = require("../models/note")

blogsRouter.get("/", (request, response) =>{
    Blog.find({}).then(blog => response.json(blog))
})

blogsRouter.get("/:id", (request, response, next) => {
    Blog.findById(request.params.id)
    .then(blog => {
        if(blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    }).catch(error => next(error))
})

blogsRouter.post("/", (request, response, next) => {
    const body = request.body

    const blog = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    })

    blog.save().then(savedBlog => {
        response.json(savedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter