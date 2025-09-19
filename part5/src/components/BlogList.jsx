
import Blog from './Blog'

const BlogList = ({ blogs, handleLikes, handleDelete, user }) => {

  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)
  return (
    <div>
      <h2>blogs</h2>
      {
        sortedBlogs.map(blog => <Blog key = {blog.id} blog = {blog} user = {user} handleLikes = {handleLikes}  handleDelete={handleDelete}/>)
      }
    </div>
  )
}


export default BlogList