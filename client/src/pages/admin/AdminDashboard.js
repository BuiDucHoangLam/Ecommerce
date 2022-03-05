import React, {useEffect,useState} from 'react'
import AdminNav from '../../component/nav/AdminNav'
import { getOrders,changeStatus } from '../../functions/admin'
import {useSelector} from 'react-redux'
import {toast} from 'react-toastify'
import Orders from '../../component/order/Orders'

const AdminDashboard = () => {
  const [orders,setOrders] = useState([])
  const {user} = useSelector(state => state)

  useEffect(()=> {
    const ac = new AbortController()
    const loadAllOrders = () => {
      getOrders(user.token).then(res => {
        console.log(res.data);
        setOrders(res.data)
      })
    }

    loadAllOrders()
    return () => ac.abort()
  },[user.token])

  const loadAllOrders = () => {
    getOrders(user.token).then(res => {
      console.log(res.data);
      setOrders(res.data)
    })
  }

  const handleStatusChange = (orderStatus,orderId) => {
    changeStatus(user.token,orderStatus,orderId).then(res => {
      toast.success('Status updated')
      loadAllOrders()
    })
  }

  return (
    <div className="container-fluid">
    <div className = "row">
      <div className ="col-md-2">
        <AdminNav />
      </div>
      <div className="col-md-10">
        <Orders 
          orders = {orders}
          handleStatusChange = {handleStatusChange}
        />
      </div>
    </div>
  </div>
  )
}

export default AdminDashboard
