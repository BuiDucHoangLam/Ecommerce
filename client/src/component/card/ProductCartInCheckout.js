import React from 'react'
import ModalImage from 'react-modal-image'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { CheckCircleOutlined,CloseCircleOutlined,CloseOutlined } from '@ant-design/icons'

const ProductCartInCheckout = ({product}) => {
  const {_id,quantity,images,title,price,brand,color,shipping,count} = product
  const colors = ['Black','Brown','Silver','White','Blue']
  const dispatch = useDispatch()

  const handleColorChange = (e) => {
    let cart = []
    if(typeof window !== 'undefined') {
      if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product,i) => {
        if(product._id === _id) {
          cart[i].color = e.target.value
        }
      })
      console.log('color update color',cart);
      localStorage.setItem('cart',JSON.stringify(cart))
      
      dispatch({
        type:'ADD_TO_CART',
        payload:cart,
      })
    }
  }

  const handleQuantityChange = (e) => {
    let countHandle = e.target.value < 1 ? 1 : e.target.value
    if(countHandle > quantity) {
      toast.error(`Max available quantity: ${quantity}`)
      return
    }
    let cart = []

    if(typeof window !== 'undefined') {
      if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product,i) => {
        if(product._id === _id){
          cart[i].count = countHandle
        }
      })
      localStorage.setItem('cart',JSON.stringify(cart))

      dispatch({
        type:'ADD_TO_CART',
        payload:cart,
      })
    }
  }

  const handleRemove = () => {
    let cart = []
    if(typeof window !== 'undefined'){
      if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      cart.map((product,i) => {
        if(product._id === _id){
          cart.splice(i,1)
        }
      })
      localStorage.setItem('cart',JSON.stringify(cart))

      dispatch({
        type:'ADD_TO_CART',
        payload:cart,
      })
    }
  }

  return (
    <tbody>
      <tr>
        <td>
          <div style={{width:'100px',height:'auto'}}>
            {images.length 
            ? <ModalImage small = {images[0].url} large = {images[0].url}/>
            : ('No image yet')}
          </div>
        </td>
        <td>{title}</td>
        <td>{price}</td>
        <td>{brand}</td>
        <td>
          <select onChange={handleColorChange} name="color" className ='form-control' style ={{width:'auto'}}>
            {color ? <option>{color}</option> : <option>Select</option>}
            {colors.filter(f=> f !== color).map(c => <option key={c} value ={c}>{c}</option>)}
          </select>
        </td>
        <td className ='text-center'>
          <input type="number" className='form-control' value ={count} onChange ={handleQuantityChange} />
        </td>
        <td className ='text-center'>{shipping ? <CheckCircleOutlined className='bg-success'/> : <CloseCircleOutlined className ='bg-danger'/>}</td>
        <td className ='text-center'><CloseOutlined className = 'text-danger pointer' onClick ={()=>handleRemove(_id)} /></td>
      </tr>
    </tbody>
  )
}

export default ProductCartInCheckout
