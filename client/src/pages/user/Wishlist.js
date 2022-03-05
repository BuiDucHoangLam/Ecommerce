import React,{useState,useEffect} from 'react'
import UserNav from '../../component/nav/UserNav'
import { getWishlist,removeWishlist } from '../../functions/user'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { DeleteOutlined } from '@ant-design/icons'

const Wishlist = () => {
  const [wishlist,setWishlist] = useState([])
  const {user} = useSelector(state => state)

  useEffect(() => {
    const loadWishlist = () => {
      getWishlist(user.token).then(res => {
        console.log(res.data);
        setWishlist(res.data.wishlist)
      })
    }
    loadWishlist()
  },[user.token])

  const loadWishlist = () => {
    getWishlist(user.token).then(res => {
      console.log(res.data);
      setWishlist(res.data.wishlist)
    })
  }

  const handleRemove = productId => removeWishlist(user.token,productId).then((res)=> {
    console.log(res);
    toast.info(`Remove ${res.data.title} success!`)
    loadWishlist()
  })

  return (
    <div className="container-fluid">
      <div className = "row">
        <div className ="col-md-2">
          <UserNav />
        </div>
        <div className = "col-md-10"> 
          <h4>Wishlist</h4>
          {wishlist.map(product => 
            <div key ={product._id} className="alert alert-secondary">
              <Link to={`/product/${product.slug}`}>{product.title}</Link>
              <span onClick ={()=>handleRemove(product._id)} className ='btn btn-sm' style ={{float:'right'}}>
                <DeleteOutlined className ='text-danger'/>
              </span>
            </div>    
          )}
        </div>
      </div>
    </div>
  )
}

export default Wishlist
