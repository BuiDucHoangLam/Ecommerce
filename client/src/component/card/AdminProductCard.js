import React from 'react'
import { Card } from 'antd'
import laptop from '../../img/laptop.png'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'


const {Meta} = Card

const AdminProductCard = ({product,handleDelete}) => {
  const {title,description,images,slug} = product

  return (
    <Card
      cover={
        <img 
          alt={images[0].public_id}
          src={images && images.length ? images[0].url : laptop}
          style = {{height:'150px',objectFit:'cover'}}
          className='p-1'
        />}
      actions={[
        <Link to ={`/admin/product/${slug}`}>
          <EditOutlined className='text-warning'/>
        </Link>,
         <DeleteOutlined onClick={() => handleDelete(slug)} className='text-danger'/>
      ]}
    >
      <Meta title ={title} description = {`${description && description.substring(0,40)}...`} />
    </Card>
  )
}

export default AdminProductCard
