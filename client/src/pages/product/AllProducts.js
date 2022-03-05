import React, {useEffect,useState} from 'react'
import AdminNav from '../../component/nav/AdminNav'
import { getProductByCount,deleteProduct } from '../../functions/product'
import AdminProductCard from '../../component/card/AdminProductCard'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

const AllProducts = () => {

  const [products,setProducts] = useState([])
  const [loading,setLoading] = useState(false)

  const {user} = useSelector(state => ({...state}))

  useEffect(() => {
    loadAllProducts()
  }, [])

  const loadAllProducts = () => {
    getProductByCount(100)
    .then(res => {
      setProducts(res.data)
      setLoading(false)
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
    })
  }

  const handleDelete = (slug) => {
    const answer = window.confirm('Delete?')
    if(answer) {
      deleteProduct(slug,user.token)
      .then(res => {
        console.log(res.data);
        loadAllProducts()
        toast.success(`${res.data.title} has been deleted!`)
      })
      .catch(err=> {
        console.log(err);
        if(err.response.status === 400) toast.error(err.response.data)
        toast.error(err.response.data.error)
      })
    }
  }

  return (
    <div className="container-fluid">
    <div className = "row">
      <div className ="col-md-2">
        <AdminNav />
      </div>
      <div className = "col-md-10"> 
       {loading ?  <h4>Loading...</h4> : <h4>All Products</h4> }
        
          <div className="row">
            {products.map(product => {
              return (
                <div key={product._id} className="col-md-4">
                  <AdminProductCard 
                    product = {product} 
                    key = {product._id}
                    handleDelete ={handleDelete}
                  />
                </div>
              )
            })}
          </div>
        
      </div>
    </div>
  </div>
  )
}

export default AllProducts
