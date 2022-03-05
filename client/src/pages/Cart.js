import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import ProductCartInCheckout from '../component/card/ProductCartInCheckout'
import { userCart } from '../functions/user'

const Cart = ({history}) => {
  const {user,cart} = useSelector(state => ({...state}))
  const dispatch = useDispatch()

  const getTotal = () => {
    return cart.reduce((currentValue,nextValue)=>{
      return currentValue + nextValue.count * nextValue.price
    },0)
  }

  const saveOrderToDb = () => {
        
    userCart(cart,user.token).then(res => {
      console.log('Cart post res',res);
      if(res.data.ok) history.push('/checkout')
    }).catch(err => console.log('cart save err',err))
  }
   
  const saveCashOrderToDb = () => {
    dispatch({
      type:'COD',
      payload:true,
    })
    userCart(cart,user.token).then(res => {
      console.log('Cart post res',res);
      if(res.data.ok) history.push('/checkout')
      
    }).catch(err => console.log('cart save err',err))
  }  
  

  const showCartItems = () => {
    return <table className ='table table-bordered'>
      <thead className ='thead-light'>
        <tr>
          <th scope ='col'>Image</th>
          <th scope ='col'>Title</th>
          <th scope ='col'>Price</th>
          <th scope ='col'>Brand</th>
          <th scope ='col'>Color</th>
          <th scope ='col'>Count</th>
          <th scope ='col'>Shipping</th>
          <th scope ='col'>Remove</th>
        </tr>
      </thead>

      {cart.map(p => 
      <ProductCartInCheckout key={p._id} product = {p}/>)
      }
    </table>
  }

  return (
    <div className='container-fluid'>
      <div className="row">
        <h4>Cart / {cart.length} Products</h4>
      </div>
      <div className="row">
        <div className="col-md-8">{!cart.length 
        ? <h4>No products in cart. <Link to='/shop'>Continue Shopping</Link></h4>
        : (
          showCartItems()
        )
        }</div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c,i) => 
            <div key = {i}>
              <p>{c.title} x {c.count} = ${c.price * c.count}</p>
            </div>
          )}
          <hr />
            Total: <b>${getTotal()}</b>
          <hr />
          {
            user 
            ? <>
                <button 
                  onClick ={saveOrderToDb} 
                  className ='btn btn-sm btn-primary mt-2'
                  disabled = {!cart.length}
                  >
                  Proceed to Checkout
                </button>
                <button 
                  style ={{float:'right'}}
                  onClick ={saveCashOrderToDb} 
                  className ='btn btn-sm btn-warning mt-2'
                  disabled = {!cart.length}
                  >
                  Pay Cash on Delivery
                </button>
              </>
            : (<button className ='btn btn-sm btn-primary mt-2'>
              <Link
                style ={{color:'white'}}
                to = {{
                pathname:'/login',
                state:{from:'cart'},
              }}> Login to Checkout </Link>
            </button>)
          }
        </div>
      </div>
    </div>
  )
}

export default Cart
