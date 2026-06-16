import { NavLink } from 'react-router-dom'

const Menu = () => {
  return (
    <div className="nav-menu">
      <NavLink className="nav-link" to="/">anecdotes</NavLink>
      <NavLink className="nav-link" to="/create">create new</NavLink>
      <NavLink className="nav-link" to="/about">about</NavLink>
    </div>
  )
}

export default Menu
