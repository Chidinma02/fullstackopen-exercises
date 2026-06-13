import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch, Navigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      showNotification(`Welcome back, ${user.name || user.username}!`, 'success')
      navigate('/')
    } catch (exception) {
      console.error('Login failed:', exception)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    showNotification('Logged out successfully', 'success')
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`, 'success')
      navigate('/')
    } catch (error) {
      console.error('Create blog failed:', error)
      showNotification('failed to create blog post. check required fields.', 'error')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlogData = {
      user: blog.user ? blog.user.id : null,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlogData)
      setBlogs(blogs.map(b => b.id === blog.id ? returnedBlog : b))
    } catch (error) {
      console.error('Liking blog failed:', error)
      showNotification('failed to update likes', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        showNotification(`Blog ${blog.title} removed successfully`, 'success')
        navigate('/')
      } catch (error) {
        console.error('Deleting blog failed:', error)
        showNotification('failed to delete blog post', 'error')
      }
    }
  }

  // Find matching blog details view
  const match = useMatch('/blogs/:id')
  const matchedBlog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogout} />
      <Notification notification={notification} />
      
      <h1 style={{ marginTop: '1.5rem' }}>DevBlogs</h1>

      <Routes>
        {/* Blogs List View */}
        <Route path="/" element={
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Explore Blogs</h2>
            <div className="blogs-grid">
              {sortedBlogs.map(blog => (
                <div key={blog.id} className="blog-card" style={{ padding: '1rem 1.25rem' }}>
                  <Link to={`/blogs/${blog.id}`} className="blog-link" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                    <span className="blog-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>{blog.title}</span>
                    <span className="blog-author" style={{ color: '#94a3b8', marginLeft: '0.5rem', fontSize: '0.9rem' }}>by {blog.author}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        } />

        {/* Create Blog View */}
        <Route path="/create" element={
          user ? (
            <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Blog</h2>
              <BlogForm createBlog={createBlog} />
            </div>
          ) : (
            <Navigate replace to="/login" />
          )
        } />

        {/* Login View */}
        <Route path="/login" element={
          !user ? (
            <div className="glass-panel" style={{ maxWidth: '450px', margin: '2rem auto 0' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Sign In</h2>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="username-input">Username</label>
                  <input
                    id="username-input"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value)}
                    placeholder="Your username"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password-input">Password</label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                  Login
                </button>
              </form>
            </div>
          ) : (
            <Navigate replace to="/" />
          )
        } />

        {/* Detailed Single Blog View */}
        <Route path="/blogs/:id" element={
          <Blog 
            blog={matchedBlog} 
            handleLike={handleLike} 
            handleDelete={handleDelete} 
            currentUser={user}
          />
        } />
      </Routes>
    </div>
  )
}

export default App