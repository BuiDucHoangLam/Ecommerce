import React, { useEffect,useState } from 'react'
import UserNav from '../../component/nav/UserNav'
import { getUserOrders } from '../../functions/user'
import { useSelector } from 'react-redux'
import { CheckCircleOutlined,CloseCircleOutlined } from '@ant-design/icons'
import ShowPaymentInfo from '../../component/card/ShowPaymentInfo'
import {PDFDownloadLink} from '@react-pdf/renderer'
import Invoice from '../../component/order/Invoice'

const History = () => {
  const [orders,setOrders] = useState([])
  const {user} = useSelector(state => state)

  useEffect(()=> {
    const loadUserOrders = () => {
      getUserOrders(user.token).then(res => {
        console.log(res.data);
        setOrders(res.data)
      })
    }
    loadUserOrders()
  },[user.token])

  

  const showDownloadLink = (order) => {
  return <PDFDownloadLink 
    fileName='invoice.pdf'
    className ='btn btn-sm btn-block btn-outline-primary'
    document={
      <Invoice order = {order} />
    }>
      Download PDF
    </PDFDownloadLink >
  }

  const showOrderInTable = order => 
  <>
    <h5>Each order and it's products</h5>
    <table className ='table table-bordered'>
      <thead className='thead-light'>
      <tr>
        <th scope ='col'>Title</th>
        <th scope ='col'>Price</th>
        <th scope ='col'>Brand</th>
        <th scope ='col'>Color</th>
        <th scope ='col'>Count</th>
        <th scope ='col'>Shipping</th>
      </tr>
      </thead>
      <tbody>
        {order.products.map((p,i) => 
          <tr key={i}>
            <td><b>{p.product.title}</b></td>
            <td>{p.product.price}</td>
            <td>{p.product.brand}</td>
            <td>{p.product.color}</td>
            <td>{p.count}</td>
            <td>{p.product.shipping === 'Yes' ? <CheckCircleOutlined className='text-success'/> : <CloseCircleOutlined className='text-danger'/>}</td>
          </tr>
        )}
      </tbody>
    </table>
  </>


  const showEachOrders = () => {
    return orders.reverse().map((order,i) => 
    <div key ={i} className ='m-5 p-3 card'>
      <ShowPaymentInfo order={order} />
      {showOrderInTable(order)}
      <div className="row">
        <div className="col">
          {/* {console.log(order)} */}
          {showDownloadLink(order)}
        </div>
      </div>
    </div>)
  }

  return (
    <div className="container-fluid">
      <div className = "row">
        <div className ="col-md-2">
          <UserNav />
        </div>
        <div className = "col text-center"> 
          <h4>{orders.length ? 'User purchase orders' : 'No purchase orders'} </h4>
          {showEachOrders()}
        </div>
      </div>
    </div>
  )
}

export default History
