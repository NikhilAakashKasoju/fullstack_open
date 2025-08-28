const Blog = ({ blog }) => (

  <div>
    <p>
      Title: {blog.title} <br />
      Author: {blog.author} <br />
      Url: {blog.url}
    </p>
    <button onClick = {handleBlogDelete}>Delete</button>
  </div>  
)

export default Blog