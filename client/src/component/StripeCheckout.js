import React,{useEffect, useState} from 'react'
import { CardElement,useStripe,useElements } from '@stripe/react-stripe-js'
import { useSelector,useDispatch } from 'react-redux'
import { createPaymentIntent } from '../functions/stripe'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
import { DollarOutlined,CheckOutlined } from '@ant-design/icons'
import { Carousel } from 'react-responsive-carousel';
import { createOrder, emptyUserCart } from '../functions/user'

import "react-responsive-carousel/lib/styles/carousel.min.css";
import '../index.css'

const StripeCheckout = ({history}) => {
  const [succeeded,setSucceeded] = useState(false)
  const [error,setError] = useState(null)
  const [processing,setProcessing] = useState('')
  const [disabled,setDisabled] = useState(true)
  const [clientSecret,setClientSecret] = useState('')

  const [cartTotal,setCartTotal] = useState(0)
  const [totalAfterDiscount,setTotalAfterDiscount] = useState(0)
  const [payable,setPayable] = useState(0)

  const stripe = useStripe()
  const elements = useElements()

  const dispatch= useDispatch()
  const {user,coupon,cart} = useSelector(state => state)

  useEffect(() => {
    createPaymentIntent(user.token,coupon ).then(res => {
      console.log('create payment intent',res.data);
      setClientSecret(res.data.clientSecret)
      // additional response received on successful payment
      setCartTotal(res.data.cartTotal)
      setTotalAfterDiscount(res.data.totalAfterDiscount)
      setPayable(res.data.payable)
    })
  }, [user.token,coupon])

  const handleSubmit = async e => {
    e.preventDefault()
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret,{
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details:{
          name:e.target.name.value,
        }
      }
    })
    if(payload.error) {
      setError(`Payment failed ${payload.error.message}`)
      setProcessing(false)
    }else {
      // Get results after successful payment
      // create order and save in database for admin to process empty user cart from redux and local storage
      
      createOrder(user.token,payload)
      .then(res => {
        if(res.data){
          // empty cart from local storage
          if(typeof window !== 'undefined') 
            localStorage.removeItem('cart')
          // empty cart from redux
          dispatch({
            type:'ADD_TO_CART',
            payload:[],
          })
          // empty cart from database
          emptyUserCart(user.token)
        }
      })
      .catch(err => console.log(err))
      console.log(JSON.stringify(payload,null,4));
      setError(false)
      setProcessing(false)
      setSucceeded(true)
    }
  }

  const handleChange = async e => {
    // listen for changes in the cart element and display any errors as the customer types their card details
    setDisabled(e.empty) // disable pay button if errors
    setError(e.error ? e.error.message : '')
  }

  const cardStyle = {
    style: {
      base: {
        color:'#32325d',
        fontFamily:'Arial,sans-serif',
        fontSmoothing:'antialiased',
        fontSize:'16px',
        '::placeholder':{
          color:'#32325d',
        },
      },
      invalid: {
        color:'#fa755a',
        iconColor:'#fa755a',
      },
    },
  }

  return (
    <>
      {
        !succeeded && <div>
          {coupon && totalAfterDiscount !== undefined
          ? <p className='alert alert-success'>{`Total after discount: ${totalAfterDiscount}`}</p>
          :<p className='alert alert-danger'>No coupon applied</p>}
        </div>
      }
      <form id = 'payment-form' className="stripe-form" onSubmit = {handleSubmit}>
        <CardElement 
          id ='card-element' 
          options = {cardStyle}
          onChange = {handleChange}
        />
        <button 
          className="stripe-button"
          disabled ={processing || disabled || succeeded}
        >
          <span id ='button-text'>
            {processing 
            ? <div className ='spinner' id = 'spinner'>

            </div>
            : 'Payment'}
          </span>
        </button>
        <br />
      {error && <div className='carderror' role = 'alert'>{error}</div>}
      <p className={succeeded ? 'result-message' :'result-message hidden'}>
        Payment Successful {' '}
        <Link to ='/user/history'>
          See it in your user purchase history
        </Link>
      </p>
      </form>

      <div className="text-center pb-5">
        <Card style ={{height:'400px',padding:'none'}}
            actions ={[
              <div style ={{marginTop:'-80px'}}>
                <DollarOutlined className = 'text-info' /> <br />
                Total: ${cartTotal}
              </div>,
              <div style ={{marginTop:'-80px'}}>
                <CheckOutlined className = 'text-info' /> <br />
                Total payable: ${(payable/100).toFixed(2)}
              </div>
            ]}
            
            cover = {
            <Carousel
              showArrows={true}
              autoPlay
              infiniteLoop
            >
              {cart.map(i => <img alt ={i._id} src ={i.images[0].url} key = {i._id} style ={{objectFit:'contain',paddingBottom:'-50px'}}/> )}
              
            </Carousel>
          }
          
          // cover ={<img src={cart[0].images[0].url} style ={{height:'200px',objectFit:'contain',marginBottom:'-50px'}}/>}
          
          
        />
      </div>

      
    </>
  )
}

export default StripeCheckout
