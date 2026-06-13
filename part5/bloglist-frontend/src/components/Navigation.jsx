import { Link } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Blogs</Link>
        {user && <Link to="/create" className="nav-link">Create New</Link>}
      </div>
      
      <div className="nav-auth">
        {user ? (
          <div className="nav-user-info">
            <span>Logged in as <strong className="nav-username">{user.name || user.username}</strong></span>
            <button onClick={handleLogout} className="btn btn-danger nav-logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary nav-login-btn" style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}>Sign In</Link>
        )}
      </div>
    </nav>
  )
}

export default Navigation
