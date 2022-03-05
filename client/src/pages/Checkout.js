import React, { useEffect, useState } from 'react'
import { getUserCart,emptyUserCart,saveUserAddress,applyCoupon,createCashUserOrder } from '../functions/user'
import { useDispatch,useSelector } from 'react-redux'
import {toast} from 'react-toastify'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const Checkout = ({history}) => {
  const [products,setProducts] = useState([])
  const [total,setTotal] = useState(0)
  const [address,setAddress] = useState('') 
  const [addressSaved,setAddressSaved] = useState(false)
  const [coupon,setCoupon] = useState('')
  const [totalAfterDiscount,setTotalAfterDiscount] = useState(0)
  const [discountError,setDiscountError] = useState('')

  const dispatch = useDispatch()
  const {user,cod,coupon:cp} = useSelector(state => state)

  useEffect(() => {
    getUserCart(user.token).then(res => {
      console.log('user cart res',res);
      setProducts(res.data.products)
      setTotal(res.data.cartTotal)
    })
    .catch(err => console.log(err))
  },[user.token])

  const saveAddressToDb =() => {
    saveUserAddress(user.token,address).then(res => {
      console.log(res);
      if(res.data) {
        setAddressSaved(true)
        toast.success('Address saved!')
      }
    })
  }

  const showAddress = () => {
    return <>
      <ReactQuill 
        theme ='snow'
        value ={address}
        onChange = {setAddress}
      />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
        Save
      </button>
    </>  
  }

  const showProductSummary = () => 
    products.map((p,i) => {
      return <div key = {i}>
        <p>
          {p.product.title} ({p.color}) x {p.count} = {''} {p.count * p.price}
        </p>
      </div>
    })
  
  const applyDiscountCoupon = () => {
    applyCoupon(user.token,coupon)
    .then(res => {
      console.log('coupon applied',res.data);
      if(res.data){
        setTotalAfterDiscount(res.data)
        // update redux coupon applied
        dispatch({
          type:'COUPON_APPLIED',
          payload:true,
        })
      }
      if(res.data.err) {
        setDiscountError(res.data.err)
        // update redux coupon applied
        dispatch({
          type:'COUPON_APPLIED',
          payload:false,
        })
      }
    })
  }
  
  const showApplyCoupon = () => {
    return <>
      <input 
        type="text" 
        value = {coupon}
        onChange = {e => {
          setCoupon(e.target.value) 
          setDiscountError('')
        }}
        className ='form-control'  
      />
      <button onClick ={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
    </>
  }

  const emptyCart = () => {
    // remove from local storage
    if(typeof window !== 'undefined'){
      localStorage.removeItem('cart')
    }
    // remove from redux
    dispatch({
      type:'ADD_TO_CART',
      payload:[]
    })

    // remove from backend
    emptyUserCart(user.token)
    .then(res => {
      setProducts([])
      setTotal(0)
      setTotalAfterDiscount(0)
      setCoupon('')
      toast.info('Cart is now empty. Continue shopping!')
    })
    .catch(err => console.log(err))
  }

  const createCaseOrder = () => {
    createCashUserOrder(user.token,cod,cp).then(res => {
      console.log('User cash order created red',res);
      // empty local storage,
      if(typeof window !== 'undefined') localStorage.removeItem('cart')
      // empty cart from redux, 
      if(res.data) {
        dispatch({
          type:'ADD_TO_CART',
          payload:[]
        })
      }
      // reset coupon, 
      dispatch({
        type:'COUPON_APPLIED',
        payload:false,
      })
      // reset COD,
      dispatch({
        type:'COD',
        payload:false,
      })
      // empty cart from backend
      emptyUserCart(user.token)

      // redirect
      setTimeout(() => {
        history.push('/user/history')
      },1000)
    })
  }

  return (
    <div className='row'>
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
          {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && <p className ='bg-danger p-2'>{discountError}</p>}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>{products.length} Products </p>
        <hr />
        <p>List of products</p>
          {showProductSummary()}
        <hr />
        <p>Cart Total: ${total}</p>
          {totalAfterDiscount > 0 &&
          <p className='bg-success p-2'>Discount Applied and Total Payable: ${totalAfterDiscount}</p>}
        <div className="row">
          <div className="col-md-6">
            {cod
            ? <button 
                className="btn btn-primary" 
                disabled ={!addressSaved || !products.length}
                onClick = {createCaseOrder}
              >
                Place Order
              </button>
            : <button 
              className="btn btn-primary" 
              disabled ={!addressSaved || !products.length}
              onClick = {() => history.push('/payment')}
            >
              Place Order
            </button>}
          </div>
          <div className="col-md-6">
            <button disabled ={!products.length} onClick ={emptyCart} className="btn btn-primary">
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
