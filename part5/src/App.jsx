import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/Login'
import BlogForm from './components/BlogForm'
import BlogList from './components/BlogList'
import Togglable from './components/BlogFormTogglable'

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

  const handleLogin = async (event) => {
    event.preventDefault()
    setErrorMessage(null)
    //console.log('logging in with', username, password)

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
      setErrorMessage('wrong username or password')
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
    console.log('blog saved')

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  const handleLikes = async (blog) => {
    console.log('liked')
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }

    const returnedBlog = await blogService.update(blog.id, updatedBlog)
    setBlogs(blogs.map(b => b.id !== blog.id ? b : { ...returnedBlog, user: blog.user }))
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

      {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}

      {!user && <LoginForm
        username={username}
        password={password}
        handleLogin={handleLogin}
        setUsername={setUsername}
        setPassword={setPassword}
      />}

      {user &&
        <div>
          <p>{user.username} logged in &nbsp;
            <button onClick={handleLogout}>
              Logout
            </button>
          </p>
          <Togglable buttonLabel="Create">
            <BlogForm
              user={user}
              blogs={blogs}
              blogTitle={blogTitle}
              setBlogTitle={setBlogTitle}
              blogAuthor={blogAuthor}
              setBlogAuthor={setBlogAuthor}
              blogUrl={blogUrl}
              setBlogUrl={setBlogUrl}
              handleBlog={handleBlog}
              handleLogout={handleLogout}
            />
          </Togglable>
          <BlogList blogs={blogs} user={user} handleLikes={handleLikes} handleDelete = {handleDelete}/>
        </div>
      }
    </div>
  )
}
export default App