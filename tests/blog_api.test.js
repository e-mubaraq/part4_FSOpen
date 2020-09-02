const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('Blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

})
test.only('Blogs UID are returned as id', async () => {
    const reponse = await api.get('/api/blogs/')
    expect(reponse.body[0].id).toBeDefined()
})

afterAll(() => {
    mongoose.connection.close()
})