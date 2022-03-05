import React, { useEffect,useState } from 'react'
import { getSub } from '../../functions/sub'
import ProductCard from '../../component/card/ProductCard'

const SubHome = ({match}) => {
  const [sub,setSub] = useState({})
  const [products,setProducts] = useState([])
  const [loading,setLoading] = useState(false)

  const {slug} = match.params

  useEffect(()=> {
    setLoading(true)
    getSub(slug).then(res => {
      setSub(res.data.subs)
      setProducts(res.data.product)
      setLoading(false)
      console.log(res.data);
    })
  },[slug])

  return (
    <div className='container'>
      <div className="row">
        <div className="col">
          {loading
            ? <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading...
            </h4>
            : <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
                {products.length} Products in {sub.name} sub
              </h4>
          }
        </div>
      </div>
      <div className="row">
        {products.map(p => (
          <div className="col-md-4" key={p._id}>
            <ProductCard product = {p} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SubHome
