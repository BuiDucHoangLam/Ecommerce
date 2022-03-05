import React, { useEffect,useState } from 'react'
import {getProductsCount, getProducts} from '../../functions/product'
import ProductCard from '../card/ProductCard'
import LoadingCard from '../card/LoadingCard'
import { Pagination } from 'antd'

const NewArrivals = () => {
  const [products,setProducts] = useState([])
  const [loading,setLoading] = useState(false)
  const [productsCount,setProductsCount] = useState(0)
  const [page,setPage] = useState(1)

  useEffect(()=> {
    // Sort,order,limit
  const loadAllProducts = () => {
    setLoading(true)
    getProducts('createdAt','desc',page)
    .then(res => {
      setProducts(res.data)
      setLoading(false)
    })
    .catch(err => {
      console.log(err);
    })
  }
    loadAllProducts()
  },[page])

  useEffect(()=> {
    getProductsCount().then(res => setProductsCount(res.data))
  },[])

  

  return (
    <div>
     
      <div className="container">
        {loading 
        ? <LoadingCard count={3}/> 
        :
        <div className="row">
          {products.map(p=>{
            return(
              <div className="col-md-4" key={p._id}>
                <ProductCard product={p}/>
              </div>
            )
          })}
        </div>}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-4 p-3">
          <Pagination 
            current ={page} 
            total ={(productsCount / 3) * 10} 
            onChange={value => setPage(value)}
          />
        </nav>
      </div>
    </div>
  )
}

export default NewArrivals
