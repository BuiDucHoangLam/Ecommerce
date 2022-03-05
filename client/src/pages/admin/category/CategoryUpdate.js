import React, { useEffect, useState } from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import { useSelector } from 'react-redux'
import { updateCategory,getCategory } from '../../../functions/category'
import { toast } from 'react-toastify'
import CategoryForm from '../../../component/form/CategoryForm'

const CategoryUpdate = ({history,match}) => {
  const [name,setName] = useState('')
  const [loading,setLoading] = useState(false)

  const {user} = useSelector(state => ({...state}))
  const {slug} = match.params

  useEffect(()=>{
    getCategory(slug).then(res => {
      console.log(res);
      setName(res.data.name)
    })
    
  },[slug])

  const handleSubmit = (e) => {
    e.preventDefault()

    updateCategory(slug,{name},user.token)
    .then(res => {
      setLoading(false)
      toast.success(`Update success with new name: ${res.data.name}!`)
      setInterval(()=>history.push('/admin/category'),3000)
    })
    .catch(err => {
      setLoading(false)
      toast.error('Update error!',err)
    })
  }

  return (
    <div className="container-fluid">
      <div className = "row">
        <div className ="col-md-2">
          <AdminNav />
        </div>
        <div className = "col"> 
          {loading 
          ? <h3 className='text'>Loading ...</h3> 
          : <h3>Update category</h3>
          }
          <CategoryForm
            onSubmit = {handleSubmit}
            name = {name}
            change = {setName}
            functionality = 'Update now'
          />
          
        </div>
      </div>
    </div>
  )
}

export default CategoryUpdate
