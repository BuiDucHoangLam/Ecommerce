import React, { useState } from 'react'
import {Card,Tabs,Tooltip} from 'antd'
import { Link } from 'react-router-dom'
import { HeartOutlined,ShoppingCartOutlined } from '@ant-design/icons'
import { Carousel } from 'react-responsive-carousel';
import ProductListItem from './ProductListItem';
import StarRating from 'react-star-ratings'
import RatingModal from '../modal/RatingModal';
import { showAverage } from '../../functions/rating';
import _ from 'lodash'
import { useDispatch,useSelector } from 'react-redux';
import { addToWishList } from '../../functions/user';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import laptop from '../../img/laptop.png'

const {TabPane} = Tabs

// This is children component of Product page 
const SingleProduct = ({product,onStartClick,star}) => {
  const {title,description,images,_id} = product
  const [tooltip,setTooltip] = useState('Click to add')
  const {user} = useSelector(state => state)
  
  const dispatch = useDispatch()
  const history = useHistory()
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

  const handleAddToWishlist = e => {
    e.preventDefault()
    addToWishList(user.token,product._id).then(res => {
      console.log('added',res.data);
      toast.success('Added to wishlist!')
      history.push('/user/wishlist')
    })
  }

  return (
    <div className='row'>
      <div className="col-md-6">
      {images && images.length 
        ? <Carousel 
          showArrows={true}
          autoPlay
          infiniteLoop
        >
           {images.map(i => <img alt ={i.public_id} src ={i.url} key = {i.public_id}/>)}
          
        </Carousel>
        : <Card
            cover={<img alt ={laptop} src={laptop} className ='mb-3 cart-image'/>}
          >

          </Card>}

          <Tabs type ='card'>
            <TabPane tab ='Description' key = '1'>
              {description && description}
            </TabPane>
            <TabPane tab ='More' key = '2'>
              Call use on xxx xxx xxxx to learn more about this product!
            </TabPane>
          </Tabs>
      </div>     

      <div className="col-md-6">
        <h1 className ='bg-info p-3'>{title}</h1>
        {product && product.ratings && product.ratings.length > 0
          ? showAverage(product)
          : <div className="text-center pt-1 pb-3">
            No rating yet
          </div>
        }
        <Card
          actions = {[
            <Tooltip title={product.quantity < 1 ? 'Out of stock' :tooltip} disabled ={product.quantity < 1}>
              <a onClick ={handleAddToCart} disabled = {product.quantity < 1}>
                <ShoppingCartOutlined className ='text-danger' />
                <br />
                {product.quantity < 1 ? 'Out of stock' : 'Add to cart'} 
              </a>
            </Tooltip>,
            <Link to='/' onClick={handleAddToWishlist}>
              
              <HeartOutlined className ='text-info'/> <br /> Add to Wishlist
              
            </Link>,
            <RatingModal>
              <StarRating 
                name={_id}
                rating={star}
                changeRating={onStartClick}
                isSelected={true}
                starRatedColor = 'red'
              />
            </RatingModal>
          ]}
        >
          {/* <Meta 
            title = {title}
            description = {description}
          /> */}
          <ProductListItem product ={product}/>
        </Card>
      </div>
    </div>
  )
}

export default SingleProduct
