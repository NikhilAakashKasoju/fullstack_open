const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcrypt')
const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')

beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
})

describe('when there is initially one user in db', () => {
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert.strictEqual(usernames.includes(newUser.username), true)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root',
            name: 'Duplicate User',
            password: 'password123',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('expected `username` to be unique') || result.body.error.includes('Username must be unique'))

        const usersAtEnd = await User.find({})
        assert.deepStrictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is too short', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'ab',
            name: 'Short Username',
            password: 'password123',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Username must be at least 3 characters long'))

        const usersAtEnd = await User.find({})
        assert.deepStrictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is missing', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            name: 'No Username',
            password: 'password123',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Username must be at least 3 characters long') || result.body.error.includes('Path `username` is required'))

        const usersAtEnd = await User.find({})
        assert.deepStrictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is too short', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'validuser',
            name: 'Valid User',
            password: 'pw',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters long'))

        const usersAtEnd = await User.find({})
        assert.deepStrictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is missing', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'validuser',
            name: 'Valid User',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('Password must be at least 3 characters long'))

        const usersAtEnd = await User.find({})
        assert.deepStrictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})