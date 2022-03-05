import axios from 'axios'

export const getOrders = async authtoken => {
  return await axios.get(`${process.env.REACT_APP_API}/admin/orders`,{
    headers: {
      authtoken
    }
  })
}

export const changeStatus = async (authtoken,orderStatus,orderId) =>
await axios.put(`${process.env.REACT_APP_API}/admin/order-status`,{orderStatus,orderId},{
  headers: {
    authtoken
  }
})