const Blog = require('../models/blog')

const initialBlogs = [
    {
    title: "CMU life",
    author: "Mubarak Mikail",
    url: "this is the url",
    likes: 4,
    id: "5f43da07024d864c55211d4e"
    },
    {
    title: "Ife life",
    author: "Jubril Edu",
    url: "this is the url",
    likes: 41,
    id: "5f43dabd024d864c55211d4f"
    },
    {
    title: "Ife life",
    author: "Jubril Edu",
    url: "this is the url",
    likes: 41,
    id: "5f43f218e9bd6064715eb2b7"
    }
]

const nonExistingId = async () => {
    const blog = new Blog ({title: 'Not existent blog'})
    blog.save()
    blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}