import React, { useState } from 'react'
import { Modal } from 'antd'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { StarOutlined } from '@ant-design/icons'
import { useHistory,useParams } from 'react-router'

const RatingModal = ({children}) => {
  const [modalVisible,setModalVisible] = useState(false)
  
  const {user} = useSelector(state => ({...state}))
  const history = useHistory()
  const params = useParams()

  console.log(params);

  const handleModal = () => {
    if(user && user.token) {
      setModalVisible(true)
    } else {
      history.push({
        pathname:'/login',
        state:{from:`/product/${params.slug}`}
      })
    }
  }

  return (
    <div>
      <div onClick ={handleModal}>
        <StarOutlined className='text-danger'/>
        <br /> {' '}  
        {user ? 'Leave Rating' : 'Login to leave Rating'}
      </div>
      <Modal 
        title='Leave your rating'
        centered
        visible = {modalVisible}
        onOk={()=>{
          setModalVisible(false)
          toast.success('Thanks for your review, which will appear soon!')
        }}  
        onCancel={() => setModalVisible(false)}
      >
        {children}
      </Modal>    
    </div>
  )
}

export default RatingModal
