
const BlogForm = ({ blogTitle, setBlogTitle, blogAuthor, setBlogAuthor, blogUrl, setBlogUrl, handleBlog }) => {
  return (
    <div className = "blog-form">
      <br />
      <div>
        <form onSubmit={handleBlog}>
          <div>
            <label>
                            Title:
              <input type="text" value={blogTitle} onChange={({ target }) => setBlogTitle(target.value)} />
            </label>
          </div>

          <div>
            <label>
                            Author:
              <input type="text" value={blogAuthor} onChange={({ target }) => setBlogAuthor(target.value)} />
            </label>
          </div>

          <div>
            <label>
                            Url:
              <input type="text" value={blogUrl} onChange={({ target }) => setBlogUrl(target.value)} />
            </label>
          </div>
          <br />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>



  )
}


export default BlogForm