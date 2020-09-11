const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const { request, response } = require('express')

usersRouter.post('/', async (request, response) => {
    const body = request.body

    if(body.password.length < 3) {
        return response.status(400).send('Password must be greater than or equal 3 characters').end()
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter