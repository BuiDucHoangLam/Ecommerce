import React from 'react'
import { Link } from 'react-router-dom'

const UserNav = () => {
  return (
    <nav>
      <ul className = "nav flex-column">
        <li className="nav-link">
          <Link to="/user/history">History</Link>
        </li>
        <li className="nav-link">
          <Link to="/user/password">Password</Link>
        </li>
        <li className="nav-link">
          <Link to="/user/wishlist">WishList</Link>
        </li>
      </ul>

    </nav>
  )
}

export default UserNav
