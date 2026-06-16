import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import UsersList from './components/UsersList'
import UserDetail from './components/UserDetail'
import { useBlogStore } from './stores/blogStore'
import { useUserStore } from './stores/userStore'
import { useNotificationStore } from './stores/notificationStore'
import { useField } from './hooks'

const App = () => {
  const { blogs, fetchBlogs, createBlog } = useBlogStore()
  const { user, initializeUser, login, logout } = useUserStore()
  const { notification, showNotification } = useNotificationStore()

  const navigate = useNavigate()

  const { reset: resetUsername, ...username } = useField('text')
  const { reset: resetPassword, ...password } = useField('password')

  useEffect(() => {
    fetchBlogs()
    initializeUser()
  }, [fetchBlogs, initializeUser])

  const handleLoginSubmit = async (event) => {
    event.preventDefault()
    try {
      await login(username.value, password.value)
      resetUsername()
      resetPassword()
      showNotification('Logged in successfully!', 'success')
      navigate('/')
    } catch (exception) {
      console.error('Login failed:', exception)
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogoutClick = () => {
    logout()
    showNotification('Logged out successfully', 'success')
    navigate('/')
  }

  const handleCreateBlog = async (blogObject) => {
    try {
      const returnedBlog = await createBlog(blogObject)
      showNotification(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
        'success'
      )
      navigate('/')
    } catch (error) {
      console.error('Create blog failed:', error)
      showNotification('failed to create blog post. check required fields.', 'error')
    }
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <div>
      <Navigation user={user} handleLogout={handleLogoutClick} />
      <Notification notification={notification} />

      <h1 style={{ marginTop: '1.5rem' }}>DevBlogs</h1>

      <ErrorBoundary>
        <Routes>
          {/* Blogs List View */}
          <Route
            path="/"
            element={
              <div className="glass-panel">
                <h2 style={{ marginBottom: '1.5rem', textAlign: 'left' }}>Explore Blogs</h2>
                <div className="blogs-grid">
                  {sortedBlogs.map((blog) => (
                    <div key={blog.id} className="blog-card" style={{ padding: '1rem 1.25rem' }}>
                      <Link
                        to={`/blogs/${blog.id}`}
                        className="blog-link"
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                      >
                        <span
                          className="blog-title"
                          style={{ fontSize: '1.1rem', fontWeight: 600 }}
                        >
                          {blog.title}
                        </span>
                        <span
                          className="blog-author"
                          style={{ color: '#94a3b8', marginLeft: '0.5rem', fontSize: '0.9rem' }}
                        >
                          by {blog.author}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            }
          />

          {/* Create Blog View */}
          <Route
            path="/create"
            element={
              user ? (
                <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Create New Blog</h2>
                  <BlogForm createBlog={handleCreateBlog} />
                </div>
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />

          {/* Users List View */}
          <Route path="/users" element={user ? <UsersList /> : <Navigate replace to="/login" />} />

          {/* Individual User View */}
          <Route
            path="/users/:id"
            element={user ? <UserDetail /> : <Navigate replace to="/login" />}
          />

          {/* Login View */}
          <Route
            path="/login"
            element={
              !user ? (
                <div className="glass-panel" style={{ maxWidth: '450px', margin: '2rem auto 0' }}>
                  <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Sign In</h2>
                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="username-input">Username</label>
                      <input
                        id="username-input"
                        {...username}
                        placeholder="Your username"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password-input">Password</label>
                      <input id="password-input" {...password} placeholder="••••••••" required />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', marginTop: '1rem' }}
                    >
                      Login
                    </button>
                  </form>
                </div>
              ) : (
                <Navigate replace to="/" />
              )
            }
          />

          {/* Detailed Single Blog View */}
          <Route path="/blogs/:id" element={<Blog />} />

          {/* Splat Route for 404 Page Not Found */}
          <Route
            path="*"
            element={
              <div className="glass-panel" style={{ textAlign: 'center', marginTop: '2rem' }}>
                <h2>404 - Page Not Found</h2>
                <p style={{ color: '#94a3b8', margin: '1.5rem 0' }}>
                  The page you are looking for does not exist.
                </p>
                <Link to="/" className="btn btn-primary">
                  Go to Home
                </Link>
              </div>
            }
          />
        </Routes>
      </ErrorBoundary>
    </div>
  )
}

export default App
