import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    )
  }

  const blogForm = () => {
    return (
      <div>
        <div>
          <p>{user.username} logged in </p>
          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
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
        <div>
          <h2>blogs</h2>
          {blogs.filter(blog => blog.user && blog.user.username === user.username)
            .map(blog =>
              <Blog key={blog.id} blog={blog} />
            )}
        </div>
      </div>

    )
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    setErrorMessage(null)
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
      setErrorMessage(null)
    } catch (error) {
      console.log('login failed', error)
      setErrorMessage("wrong username or password")
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedUser')
  }

  const handleBlog = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    }

    const saved = await blogService.create(newBlog)
    setSuccessMessage(`a new blog ${saved.title} is added by ${saved.author}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
    setBlogs(blogs.concat(saved))
    console.log("blog saved")

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  const handleBlogDelete = () => {
    
  }

  return (
    <div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      {successMessage && <div style = {{color: 'green'}}>{successMessage}</div>}
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )

}
export default App