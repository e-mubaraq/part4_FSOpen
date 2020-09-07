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

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
      if(blog) {
          response.json(blog)
      }
      else {
          response.status(404).end()
      }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

})

module.exports = blogsRouter