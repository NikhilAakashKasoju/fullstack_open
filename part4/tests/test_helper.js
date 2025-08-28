const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'Test Blog 1',
    author: 'Author 1',
    url: 'http://test1.com',
    likes: 5
  },
  {
    title: 'Test Blog 2',
    author: 'Author 2',
    url: 'http://test2.com',
    likes: 10
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb
}