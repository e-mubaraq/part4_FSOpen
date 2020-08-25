const _ = require('lodash')
const dummy = blogs => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes 
    , 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    }
    const favBlog = blogs.reduce((a, b) => b.likes > a.likes ? b : a)
    const { _id, url, __v, ...favBlog3} = favBlog

    return favBlog3
}

const mostBlogs = (blogs) => {
    const authorWithMostBlogs = _
        .chain(blogs)
        .countBy('author')
        .map((blogs, author) => ({ blogs, author }))
        .sortBy('blogs')
        .last()
        .value()
    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    const authorWithMostLikes = _
        .chain(blogs)
        .groupBy('author')
        .map((objects, key) => ({ 'author': key, 'likes': _.sumBy(objects, 'likes')}))
        .sortBy('likes')
        .last()
        .value()
    console.log(authorWithMostLikes)
    
    return authorWithMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
