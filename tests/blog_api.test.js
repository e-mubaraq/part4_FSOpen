const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)

test('Blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

})
test('Blogs UID are returned as id', async () => {
    const reponse = await api.get('/api/blogs/')
    expect(reponse.body[0].id).toBeDefined()
})
describe('POST request tests', () => {
    test('http post request for the blogs', async () => {
        const prevBlogs = await api.get('/api/blogs')
        const newBlog = {
            "title": "Lagos good life",
            "author": "Martin White",
            "url": "url inserted",
            "likes": 34
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
    
        const response = await api.get('/api/blogs')
        const titles = response.body.map(b => b.title)
        expect(response.body).toHaveLength(prevBlogs.body.length + 1)
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
        const prevBlogs = await api.get('/api/blogs')
        const newBlog = {
            "author": "No title Author",
            "likes": 9
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(prevBlogs.body.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})