const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { request, response } = require('../app')


blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
    })
})
  
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    if (blog.title === undefined && blog.url === undefined) {
      response.status(400).end()
      return
    }
    await blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })

})

blogsRouter.get('/:id', (request, response) => {
    Blog
      .findById(request.params.id)
      .then(blog => {
        if(blog) {
            response.json(blog)
        }
        else {
            response.status(404).end()
        }
      })
})

module.exports = blogsRouter