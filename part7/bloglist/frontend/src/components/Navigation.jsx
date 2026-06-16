import { NavLink } from 'react-router-dom'

const Navigation = ({ user, handleLogout }) => {
  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <NavLink to="/" className="nav-link">
          Blogs
        </NavLink>
        {user && (
          <NavLink to="/users" className="nav-link">
            Users
          </NavLink>
        )}
        {user && (
          <NavLink to="/create" className="nav-link">
            Create New
          </NavLink>
        )}
      </div>

      <div className="nav-auth">
        {user ? (
          <div className="nav-user-info">
            <span>
              Logged in as <strong className="nav-username">{user.name || user.username}</strong>
            </span>
            <button onClick={handleLogout} className="btn btn-danger nav-logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className="btn btn-secondary nav-login-btn"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
          >
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  )
}

export default Navigation
