const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const api = supertest(app)

let token = null
let userId = null

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    // Create a test user
    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({
        username: 'testuser',
        name: 'Test User',
        passwordHash
    })
    const savedUser = await user.save()
    userId = savedUser._id

    // Generate token
    const userForToken = {
        username: savedUser.username,
        id: savedUser._id
    }
    token = jwt.sign(userForToken, process.env.SECRET)

    // Create blogs with the user
    const blogObjects = helper.initialBlogs.map(blog => new Blog({
        ...blog,
        user: userId
    }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close()
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is returned', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert.strictEqual(titles.includes("Test Blog 1"), true)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'New Test Blog',
        author: 'New Author',
        url: 'http://newblog.com',
        likes: 7
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(titles.includes('New Test Blog'))
})

test('blog posts have id property instead of _id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.strictEqual(blog.hasOwnProperty('id'), true)
        assert.strictEqual(blog.hasOwnProperty('_id'), false)
    })
    const blog = response.body[0]
    assert.strictEqual(blog.id !== undefined, true)
    assert.strictEqual(blog._id, undefined)
})

test('blogs without likes property defaults to 0', async () => {
    const newBlog = {
        title: 'Blog without likes',
        author: 'Test Author',
        url: 'http://test.com'
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
    const blogsAfter = await api.get('/api/blogs')
    const savedBlog = blogsAfter.body.find(blog => blog.title === 'Blog without likes')
    assert.strictEqual(savedBlog.likes, 0)
})

test('blog without title returns 400 bad request', async () => {
    const newBlog = {
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('blog without url returns 400 Bad Request', async () => {
    const newBlog = {
        title: 'Test Blog',
        author: 'Test Author',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('blog without title and url returns 400 Bad Request', async () => {
    const newBlog = {
        author: 'Test Author',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

test('when a specific blog is deleted', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]
    const blogIdToDelete = blogToDelete.id

    await api
        .delete(`/api/blogs/${blogIdToDelete}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, helper.initialBlogs.length - 1)
    const remainingIds = blogsAtEnd.body.map(blog => blog.id)
    assert.strictEqual(remainingIds.includes(blogIdToDelete), false)
})

test('when updating individual information', async () => {
    const blogAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogAtStart.body[0]

    const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 42
    }

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.title, updatedBlog.title)
    assert.strictEqual(response.body.author, updatedBlog.author)
    assert.strictEqual(response.body.url, updatedBlog.url)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
})

test('updating a non-existent blog returns 404', async () => {
    const nonExistentId = new mongoose.Types.ObjectId()
    const updateData = {
        title: 'Test Title',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 100
    }

    await api
        .put(`/api/blogs/${nonExistentId}`)
        .send(updateData)
        .expect(404)
})

test('number of likes can be updated for a blog post', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    const originalLikes = blogToUpdate.likes
    const newLikes = originalLikes + 100

    const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: newLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, newLikes)
    assert.strictEqual(response.body.title, blogToUpdate.title)
    assert.strictEqual(response.body.author, blogToUpdate.author)
    assert.strictEqual(response.body.url, blogToUpdate.url)
    assert.strictEqual(response.body.id, blogToUpdate.id)

    const blogsAfterUpdate = await api.get('/api/blogs')
    const updatedBlog = blogsAfterUpdate.body.find(blog => blog.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.likes, newLikes)
})

// Add test for unauthorized blog creation
test('adding blog without token fails with 401', async () => {
    const newBlog = {
        title: 'Unauthorized Blog',
        author: 'Unauthorized',
        url: 'http://unauthorized.com',
        likes: 5
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
})