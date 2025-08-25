const blogsRouter = require("express").Router()

const Blog = require("../models/blog")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.get("/:id", async (request, response, next) => {

    const blog = await Blog.findById(request.params.id)

    if (blog) {
        response.json(blog)
    } else {
        response.status(400).end()
    }
})

blogsRouter.post("/", async (request, response, next) => {
    const body = request.body
    
    if (!body.title) {
      return response.status(400).json({ error: 'Title is required' })
    }
    
    if (!body.url) {
      return response.status(400).json({ error: 'URL is required' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
    
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, { title, author, url, likes })

    const freshBlog = await Blog.findById(request.params.id)

    response.json(freshBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    const { likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { likes }
    )

    response.json(updatedBlog)
})

module.exports = blogsRouter