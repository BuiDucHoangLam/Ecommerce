import React, { useEffect, useState } from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import { useSelector } from 'react-redux'
import { createCategory,getCategories,deleteCategory } from '../../../functions/category'
import { toast } from 'react-toastify'
import {EditOutlined,DeleteOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import CategoryForm from '../../../component/form/CategoryForm'
import LocalSearch from '../../../component/form/LocalSearch'

const CategoryCreate = () => {
  const [name,setName] = useState('')
  const [loading,setLoading] = useState(false)
  const [categories,setCategories] = useState([])

  // Search: step 1
  const [keyword,setKeyword] = useState('')

  const {user} = useSelector(state => ({...state}))
  useEffect(()=> {
    loadCategories()
  },[])

  const loadCategories = () => {
    getCategories().then(res =>setCategories(res.data))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    createCategory({name},user.token)
    .then(res => {
      console.log(res);
      setLoading(false)
      toast.success(`${res.data.name} is created!`)
      loadCategories()
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
      if(err.response.status === 400) toast.error(err.response.data)
    })
  }

  const handleRemove = async (slug) => {
    // const answer = window.confirm(`You really want to delete this category '${slug}'?`)
    if(window.confirm(`You really want to delete this category '${slug}'?`)) {
      setLoading(true)
      deleteCategory(slug,user.token)
      .then(res => {
        setLoading(false)
        toast.info(`'${res.data.name} have been deleted!'`)
        loadCategories()
      })
      .catch(err=>{
        console.log(err);
        if(err.response.status === 401){
          setLoading(false)
          toast.error(err.message.data)
        }
      })
    }
  }

  // Search: step 3
  const searched = keyword => category => {
    return category.name.toLowerCase().includes(keyword)
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
          : <h3>Create new category</h3>
          }
          <CategoryForm
            onSubmit = {handleSubmit}
            name = {name}
            change = {setName}
            functionality = 'Create now'
          />

          <br/>

          <LocalSearch 
            keyword ={keyword}
            setKeyword ={setKeyword}
          />

         

          {/* Search: Step 2 */}
                
          
          <hr/>
          {/* Search: step 5 */}
          {categories.filter(searched(keyword)).map(c => (
            <div 
              className ="alert alert-secondary" 
              key ={c._id}>
                {c.name}
              <span onClick ={()=>handleRemove(c.slug)} style={{float:'right'}} className="btn btn-sm float-right">
                <DeleteOutlined className="text-danger"/>
              </span> 
              
              <Link style={{float:'right'}} className="btn btn-sm float-right" to={`/admin/familia/${c.slug}`}>
                <EditOutlined className="text-primary"/>
              </Link>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryCreate
