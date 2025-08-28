const blogsRouter = require("express").Router()
const jwt = require("jsonwebtoken")
const Blog = require("../models/blog")
const User = require("../models/user")
const { userExtractor } = require("../utils/middleware")

const getTokenFrom = request => {
  return request.token
}

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
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

// const getTokenFrom = request => {
    
//     const authorization = request.get('authorization')
//     if (authorization && authorization.startsWith('Bearer ')) {
//         return authorization.replace('Bearer ', '')
//     }
//     return null
// }

blogsRouter.post("/", userExtractor, async (request, response, next) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {username: 1, name: 1, id: 1})
    response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    const user = request.user

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: "blog not found" })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(403).json({ error: "only the creator can delete this blog" })
    }

    await Blog.findByIdAndDelete(request.params.id)
    
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
    await user.save()

    response.status(204).end()
})


blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id, 
      { title, author, url, likes }, 
      { new: true, runValidators: true }
    ).populate('user', { username: 1, name: 1, id: 1 })

    if (!updatedBlog) {
      return response.status(404).json({ error: "blog not found" })
    }
    
    response.json(updatedBlog)

})

// blogsRouter.put('/:id', async (request, response) => {
//     const { likes } = request.body

//     const updatedBlog = await Blog.findByIdAndUpdate(
//         request.params.id,
//         { likes }
//     )

//     response.json(updatedBlog)
// })


module.exports = blogsRouter