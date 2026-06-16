import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import usersService from '../services/users'

const UserDetail = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    usersService.getAll().then((data) => {
      const foundUser = data.find((u) => u.id === id)
      setUser(foundUser)
    })
  }, [id])

  if (!user) {
    return (
      <div className="glass-panel">
        <p>User not found</p>
      </div>
    )
  }

  return (
    <div className="glass-panel">
      <h2 style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{user.name || user.username}</h2>
      <div style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>Added blogs</div>

      {user.blogs.length > 0 ? (
        <div className="blogs-grid">
          {user.blogs.map((blog) => (
            <div key={blog.id} className="blog-card" style={{ padding: '1rem 1.25rem' }}>
              <Link
                to={`/blogs/${blog.id}`}
                className="blog-link"
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <span className="blog-title" style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  {blog.title}
                </span>
                {blog.author && (
                  <span
                    className="blog-author"
                    style={{ color: '#94a3b8', marginLeft: '0.5rem', fontSize: '0.9rem' }}
                  >
                    by {blog.author}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>
          This user hasn't added any blogs yet.
        </p>
      )}
    </div>
  )
}

export default UserDetail
