import React, { useEffect, useState } from 'react'
import { getProduct,productStar,getRelated } from '../functions/product'
import SingleProduct from '../component/card/SingleProduct'
import { useSelector } from 'react-redux'
import ProductCard from '../component/card/ProductCard'

const Product = ({match}) => {
  const [product,setProduct] = useState({})
  const [star,setStar] = useState(0)
  const [related,setRelated] = useState([])

  const {slug} = match.params

  const {user} =  useSelector(state => ({...state}))

  useEffect(() => {
    const loadSingleProduct = () => 
    getProduct(slug).then(res => {
      setProduct(res.data)
      getRelated(res.data._id).then(rel => setRelated(rel.data))
    })
    loadSingleProduct()
  },[slug])

  useEffect(() => {
    if(product.ratings && user) {
      let existingRatingObject = product.ratings.find(el => {
        return el.postedBy.toString() === user._id.toString()
      })
      existingRatingObject && setStar(existingRatingObject.star) // current user's star
    }
  },[product.ratings,user])

  const loadSingleProduct = () => 
    getProduct(slug).then(res => {
      setProduct(res.data)
      getRelated(res.data._id).then(rel => setRelated(rel.data))
    })
    
  

  const onStartClick = (newRating,name) => {
    setStar(newRating)
    productStar(name,newRating,user.token)
    .then(res => {
      console.log('rating',res.data);
      loadSingleProduct() // if you want to show updated rating in real time
    })
    .catch(err => {
      console.log(err);
    })
  }
  return (
    <div className = "container-fluid">
      <div className="row pt-4">
        <SingleProduct 
          product = {product} 
          onStartClick={onStartClick} 
          star = {star}/>
        </div>
      <div className="row p-5">
        <div className="col text-center pt-5">
          <hr />
            <h4>Related Product</h4>
          <hr />
        </div> 
      </div>
      <div className="container">
       
        <div className="row">
          {related.length > 0
          ? related.map(p=>{
            return(
              <div className="col-md-4" key={p._id}>
                <ProductCard product={p}/>
              </div>
            )
          })
          : <div className ="text-center pt-1 pb-3"> No related Product </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Product
