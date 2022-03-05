import React from 'react'
import { Link } from 'react-router-dom'

const AdminNav = () => {
  return (
    <nav>
      <ul className = "nav flex-column">
        <li className="nav-link">
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li className="nav-link">
          <Link to="/admin/product">Product</Link>
        </li>
        <li className="nav-link">
          <Link to="/admin/products">Products</Link>
        </li>
        <li className="nav-link">
          <Link to="/admin/category">Category</Link>
        </li>
        <li className="nav-link">
          <Link to="/admin/sub">Sub Category</Link>
        </li>
        <li className="nav-link">
          <Link to="/admin/coupon">Coupon</Link>
        </li>
        <li className="nav-link">
          <Link to="/admin/password">Password</Link>
        </li>
      </ul>

    </nav>
  )
}

export default AdminNav
