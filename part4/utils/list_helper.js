const _ = require("lodash")

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favourite, current) => {
    return current.likes > favourite.likes ? current : favourite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = _.countBy(blogs, 'author')
  const maxCount = _.max(Object.values(counts))

  const topAuthor = _(counts)
    .toPairs()
    .filter(([author, count]) => count === maxCount)
    .sortBy(([author]) => author)
    .map(([author]) => author)
    .first()

  return { author: topAuthor, blogs: maxCount }
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0) return null

  const byAuthor = _.groupBy(blogs, 'author')

  const likesPerAuthor = _.map(byAuthor, (posts, author) => ({
    author,
    likes: _.sumBy(posts, 'likes')
  }))

  return _.maxBy(likesPerAuthor, 'likes')
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes,
}