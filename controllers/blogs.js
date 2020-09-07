const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { request, response } = require('../app')
const { update } = require('../models/blog')


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
  const body = request.body
  const blog = {
    likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.status(200).json(updatedBlog.toJSON())
})

module.exports = blogsRouter