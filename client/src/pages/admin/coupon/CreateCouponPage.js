import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getCoupons,createCoupon,removeCoupon } from '../../../functions/coupon'
import { DeleteOutlined } from '@ant-design/icons'
import AdminNav from '../../../component/nav/AdminNav'

const CreateCouponPage = () => {
  const [name,setName] = useState('')
  const [expiry,setExpiry] = useState('')
  const [discount,setDiscount] = useState('')
  const [loading,setLoading] = useState('')
  const [coupons,setCoupons] = useState([])
  // redux
  const {user} = useSelector(state => state)

  useEffect(() => {
   loadAllCoupons()
  },[])

  const loadAllCoupons = () =>  getCoupons().then(res => {
    console.log(res.data);
    setCoupons(res.data)

  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createCoupon({name,expiry,discount},user.token)
    .then(res => {
      setLoading(false)
      loadAllCoupons()
      setName('')
      setDiscount('')
      setExpiry('')
      toast.success(`${res.data.name} is created!`)
    })
    .catch(err => {
      console.log('create coupon err',err);
      toast.error('create coupon err',err)
    })
  }

  const handleRemove = couponId => {
    if(window.confirm('Delete?')){
      setLoading(true)
      removeCoupon(couponId,user.token).then(res => {
        loadAllCoupons()
        setLoading(false)
        toast.info(`Coupon ${res.data.name} deleted!`)
      })
      .catch(err => console.log('remove err',err))
    }
  }

  return (
    <div className='container-fluid'>
      <div className="row">
        <div className ="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading
          ? <h4 className='text-danger'>Loading...</h4>
          : <h4>Coupon</h4> }
          <hr />
          <form onSubmit = {handleSubmit}>
            <div className="form-group">
              <label className = 'text-muted'>Name</label>
              <input 
                type="text" 
                className="form-control" 
                onChange ={e=>setName(e.target.value)} 
                value = {name} 
                autoFocus 
                required
              />

              <label className = 'text-muted'>Discount (%)</label>
              <input 
                type="text" 
                className="form-control" 
                onChange ={e=>setDiscount(e.target.value)} 
                value = {discount}
                required
              />

              <label className = 'text-muted'>Expiry</label>
              <br />
              <DatePicker 
                className='form-control'
                selected={expiry || new Date()}
                value = {expiry}
                onChange ={date => setExpiry(date)}
                required
              />
            </div>
            <br />
            <button 
              className="btn btn-outline-primary"
              onClick ={handleSubmit}
            >
              Save
            </button>
          </form>

          <hr />
          <h4>{coupons.length} coupons</h4>
          <table className ='table table-bordered'>
            <thead className ='thead-light'>
              <tr>
                <th scope = 'col'>Name</th>
                <th scope = 'col'>Expiry</th>
                <th scope = 'col'>Discount</th>
                <th scope = 'col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => 
                <tr key ={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}%</td>
                  <td><DeleteOutlined className ='text-danger pointer' onClick ={() => handleRemove(c._id)}/></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CreateCouponPage
