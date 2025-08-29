import BlogTogglable from "./BlogTogglable"

const Blog = ({ blog, handleLikes }) => (

  <div>
      Title: {blog.title}  Author: {blog.author}
      <BlogTogglable buttonLabel="View">
        Url: {blog.url} <br />
        likes: {blog.likes} <button onClick = {() => handleLikes(blog)}>Like</button>
      </BlogTogglable>
  </div>
)

export default Blog