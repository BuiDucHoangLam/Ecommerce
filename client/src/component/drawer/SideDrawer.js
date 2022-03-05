import React from 'react'
import {Drawer,Button} from 'antd'
import { useSelector,useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'

const SideDrawer = () => {
  const dispatch = useDispatch()
  const {drawer,cart} = useSelector(state => state)

  const imageStyle = {
    with:'100%',
    height:'100px',
    objectFit:'contain'
  }

  return (
    <Drawer 
      className='text-center'
      title={`Cart / ${cart.length} products`}
      placement ='right'
      closable = {false}
      onClose={()=>{
        dispatch({
          type:'SET_VISIBLE',
          payload:false,
        })
    }} visible={drawer}>
      {cart.map(c => 
        <div className ='row' key={c._id}>
          <div className="col">
            {c.images[0] 
            ? <>
                <img src={c.images[0].url} alt={c.images[0]} style={imageStyle} /> 
                <p className="text-center bg-secondary text-light">{c.title} x {c.count}</p>
              </>
            : <>
                <p>('Not image yet') </p>
                <p className="text-center bg-secondary text-light">{c.title} x {c.count}</p>
              </>
            }
          </div>
        </div>)}
      <Link  to ='/cart'>
        <Button onClick={() => {
          dispatch({
            type:'SET_VISIBLE',
            payload:false,
          })
        }} className='text-center btn btn-primary btn-raised'>
          Go to Cart
        </Button>
      </Link>
    </Drawer>
  )
}

export default SideDrawer
