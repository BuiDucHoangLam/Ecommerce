import React from 'react'
import { Link } from 'react-router-dom'

const ProductListItem = ({product}) => {
  const {price,category,subs,shipping,color,brand,sold,quantity} = product
  return (
    <div>
      <ul className="list-group">
        <li className="list-group-item">
          Price <span className="label label-default label-pill pull-xs-right" style ={{float:'right'}}>
            $ {price}
          </span>
        </li>
        {category && <li className="list-group-item">
          Category{''}
          <Link to= {`/category/${category.slug}`}
            className="label label-default label-pill pull-xs-right" style ={{float:'right'}}
          >
            {category.name}
        
          </Link>
        </li>}
        {subs && <li className="list-group-item">
           Sub Categories
           {subs.map(s =>  <Link key = {s._id} to={`/sub/${s.slug}`} className="label label-default label-pill pull-xs-right" style ={{justifyContent:'space-around',float:'right'}}>
              {s.name}
          </Link>)}
        </li>}
        <li className="list-group-item">
          Shipping{''}
           <span className="label label-default label-pill pull-xs-right" style ={{float:'right'}}>
            {shipping}
          </span>
        </li>
        <li className="list-group-item">
          Color{''}
           <span className="label label-default label-pill pull-xs-right" style ={{float:'right'}}>
            {color}
          </span>
        </li>
        <li className="list-group-item">
          Brand{''}
           <span className="label label-default label-pill pull-xs-right" style ={{float:'right'}}>
            {brand}
          </span>
        </li>
        <li className="list-group-item">
          Available{''}
           <span className="label label-default label-pill pull-xs-right" style ={{float:'right'}}>
            {quantity}
          </span>
        </li>
        <li className="list-group-item">
          Sold{''}
          Price <span className="label label-default label-pill pull-xs-right" style ={{float:'right'}}>
            {sold}
          </span>
        </li>
        
      </ul>
    </div>
  )
}

export default ProductListItem
