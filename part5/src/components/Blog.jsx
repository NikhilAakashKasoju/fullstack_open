const Blog = ({ blog }) => (

  <div>
    <p>
      Title: {blog.title} <br />
      Author: {blog.author} <br />
      Url: {blog.url}
    </p>
  </div>
)

export default Blog