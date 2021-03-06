const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1})

  response.json(blogs)
})
  
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    if (request.body.title === undefined && request.body.url === undefined) {
      response.status(400).end()
      return
    }
    
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!request.token || !decodedToken.id) {
      return response.status(401).json({error: 'Token missing or invalid'})
    }
    const user = await User.findById(decodedToken.id)
    const blog = new Blog({
      title: body.title,
      url: body.url,
      author: body.author,
      like: body.likes,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
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
  const blog = await Blog.findById(request.params.id)
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!request.token || !decodedToken.id) {
    return response.status(401).json({error: 'Token missing or invalid'})
  }
  const user = await User.findById(decodedToken.id)
  if (blog.user.toString() === user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  else {
    return response.status(401).json({error: 'A blog can only be deleted by its creator'})
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = {
    likes: body.likes
  }
  
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.status(200).json(updatedBlog.toJSON())
})

module.exports = blogsRouter