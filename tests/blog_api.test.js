const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)

const Blog = require('../models/blog')
const { nonExistingId } = require('./test_helper')

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})
describe('when there is initially some notes saved', () => {
    test('Blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })

    test('a specific blog is within the returned blogs', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(b => b.title)

        expect(titles).toContain('CMU life')
    })
})

describe('viewing a specific note', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const processesBlogToView = JSON.parse(JSON.stringify(blogToView))
        expect(resultBlog.body).toEqual(processesBlogToView)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonExistingId = await helper.nonExistingId()
        
        await api
            .get(`/api/blogs/${validNonExistingId}`)
            .expect(404)
    })

    test('fails with statuscode 500 for invalid id', async () => {
        const invalidId = '5a3d5da59070081a82a45'
        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(500)
    })
})

test('Blogs UID are returned as id', async () => {
    const reponse = await api.get('/api/blogs/')
    expect(reponse.body[0].id).toBeDefined()
})

describe('addition of a new note', () => {
    test('succeeds with valid data', async () => {
        const newBlog = {
            "title": "Lagos good life",
            "author": "Wale Ade",
            "url": "url inserted",
            "likes": 34
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).toContain('Lagos good life')
    })

    test('likes attribute missing in blog body, defaults to zero', async () => {
        const newBlog = {
            "title": "Without likes",
            "author": "Martin White",
            "url": "url inserted"
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const likes = response.body.map(b => b.likes)
        expect(likes).not.toContain(undefined)
    })

    test ('title and url missing responds with 400', async () => {
        const newBlog = {
            "author": "No title Author",
            "likes": 9
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

/* describe('deletion of a note', () =>  {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        expect(titles).not.toContain(blogToDelete.title)
    })
})*/

afterAll(() => {
    mongoose.connection.close()
})