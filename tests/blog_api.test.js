const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { response } = require('../app')
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
afterAll(() => {
    mongoose.connection.close()
})