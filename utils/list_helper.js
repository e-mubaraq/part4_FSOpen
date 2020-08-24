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
    const favBlog = blogs.reduce((a, b) => b.likes > a.likes ? b : a) //Math.max(b.likes, a.likes))
    const { _id, url, __v, ...favBlog3} = favBlog

    return favBlog3
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}
