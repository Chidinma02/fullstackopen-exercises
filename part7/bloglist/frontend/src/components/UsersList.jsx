import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import usersService from '../services/users'

const UsersList = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    usersService.getAll().then((data) => setUsers(data))
  }, [])

  return (
    <div className="glass-panel">
      <h2 style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Users</h2>

      <table style={{ width: '100%', borderCollapse: 'collapse', color: 'var(--text-primary)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
            <th
              style={{ padding: '0.75rem 1rem', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              User
            </th>
            <th
              style={{
                padding: '0.75rem 1rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                textAlign: 'center'
              }}
            >
              Blogs Created
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '1rem' }}>
                <Link
                  to={`/users/${u.id}`}
                  className="blog-link"
                  style={{ color: '#14b8a6', fontWeight: 500 }}
                >
                  {u.name || u.username}
                </Link>
              </td>
              <td
                style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#818cf8' }}
              >
                {u.blogs.length}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersList
