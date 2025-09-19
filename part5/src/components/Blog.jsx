import BlogTogglable from './BlogTogglable'

const Blog = ({ blog, handleLikes, user, handleDelete }) => {
  const canDelete = blog.user && user && (
    blog.user.username === user.username ||
    blog.user.id === user.id
  )

  return (
    <div className='blog' data-testid = 'blog-details'>
      Title: {blog.title} Author: {blog.author}
      <BlogTogglable buttonLabel="View">
        Url: {blog.url} <br />
        likes: {blog.likes} <button onClick={() => handleLikes(blog)}>Like</button>
        <p>Added by {blog.user?.name || blog.user?.username}</p>

        {canDelete && <button onClick={() => handleDelete(blog)}>Delete</button>}
      </BlogTogglable>
    </div>
  )
}

export default Blog
