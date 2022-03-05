import React, { useState } from 'react'
import {Card,Tooltip} from 'antd'
import { EyeOutlined,ShoppingCartOutlined } from '@ant-design/icons'
import laptop from '../../img/laptop.png'
import { Link } from 'react-router-dom'
import { showAverage } from '../../functions/rating'
import { useDispatch } from 'react-redux'
import _ from 'lodash'

const {Meta} = Card

const ProductCard = ({product}) => {
  const {images,title,description,slug,price} = product
  const [tooltip,setTooltip] = useState('Click to add')
  const dispatch = useDispatch()

  const handleAddToCart = () => {
   
    // Create cart product
    let cart = []
    if(typeof window !== 'undefined') {
      // if cart is in local storage GET it
      if(localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'))
      }
      // push new product to cart 
      cart.push({
        ...product,
        count:1,
      })
      // remove duplicates
      let unique = _.uniqWith(cart,_.isEqual)
      // save to local storage
      console.log('unique',unique);
      localStorage.setItem('cart',JSON.stringify(unique))
    
       // Show tooltip
      setTooltip('Added!')

      // add to redux state
      dispatch({
        type:'ADD_TO_CART',
        payload:unique,
      })
      // show cart items in sidebar drawer
      dispatch({
        type:'SET_VISIBLE',
        payload:true,
      })
    }
  }
  
  return (

    <div>
      {product && product.ratings.length > 0 
        ? showAverage(product)
        : <div className ="text-center pt-1 pb-3" style ={{fontSize:'1.2rem'}} >
          No rating yet
        </div>
      }
      <Card
        cover={
          <img 
            alt={images[0].public_id}
            src={images && images.length ? images[0].url : laptop}
            style ={{height:'200px',objectFit:'contain'}}
            className='p-1'
          />
        }
        actions = {[
          <Link to ={`/product/${slug}`}>
            <EyeOutlined className='text-warning' />
          </Link>,
          <Tooltip title={product.quantity < 1 ? 'Out of stock' : tooltip}>
            <a onClick ={handleAddToCart} disabled = {product.quantity < 1}>
              <ShoppingCartOutlined className ='text-danger' />
                <br />
                {product.quantity === 0 ? 'Out of stock' : 'Add to cart'}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title ={`${title} - $${price}`}
          description={`${description && description.substring(0,40)}...`}
        />
      
      </Card>
    </div>
  )
}

export default ProductCard
