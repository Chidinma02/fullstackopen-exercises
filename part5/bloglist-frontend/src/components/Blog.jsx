const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  if (!blog) {
    return <div className="glass-panel"><p>Blog not found</p></div>
  }

  const isCreator = blog.user && currentUser && (blog.user.username === currentUser.username)
  const isAuthenticated = currentUser !== null

  return (
    <div className="glass-panel blog-card-container">
      <h2 className="blog-title" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{blog.title}</h2>
      <div className="blog-author" style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '1.5rem' }}>
        by {blog.author}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.2rem' }}>
        <div className="blog-url">
          <a href={blog.url} target="_blank" rel="noreferrer" style={{ color: '#14b8a6', textDecoration: 'none', wordBreak: 'break-all', fontWeight: '500' }}>
            {blog.url}
          </a>
        </div>
        
        <div className="blog-likes" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#e2e8f0' }}>likes <strong style={{ fontSize: '1.1rem', color: '#818cf8' }}>{blog.likes}</strong></span>
          {isAuthenticated && (
            <button 
              onClick={() => handleLike(blog)} 
              className="btn btn-secondary" 
              style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.25)', color: '#a5b4fc' }}
            >
              Like
            </button>
          )}
        </div>

        <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Added by <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{blog.user ? (blog.user.name || blog.user.username) : 'Anonymous'}</span>
        </div>

        {isAuthenticated && isCreator && (
          <div style={{ marginTop: '0.8rem' }}>
            <button 
              onClick={() => handleDelete(blog)} 
              className="btn btn-danger"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog