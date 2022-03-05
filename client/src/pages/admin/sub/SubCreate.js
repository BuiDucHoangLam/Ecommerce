import React, { useEffect, useState } from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import { useSelector } from 'react-redux'
import { createSub,getSubs,deleteSub } from '../../../functions/sub'
import { getCategories } from '../../../functions/category'
import { toast } from 'react-toastify'
import {EditOutlined,DeleteOutlined} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import CategoryForm from '../../../component/form/CategoryForm'
import LocalSearch from '../../../component/form/LocalSearch'

const SubCreate = () => {
  const [name,setName] = useState('')
  const [loading,setLoading] = useState(false)
  const [subs,setSubs] = useState([])
  const [categories,setCategories] = useState([])
  const [category,setCategory] = useState('')

  // Search: step 1
  const [keyword,setKeyword] = useState('')

  const {user} = useSelector(state => ({...state}))

  useEffect(()=> {
    const loadSubs = () => {
      getSubs().then(res =>setSubs(res.data))
      console.log(subs);
    }

    const loadCategories = () => {
    
      getCategories().then(res =>setCategories(res.data))
      console.log(categories);
    }

    loadSubs()
    loadCategories()

  },[categories,subs])

  // const loadName = (parent) => {
  //   categories.filter(c=> 
  //     (c._id === parent)  
  //     ? c.name 
  //     : null
  //   )
  // }

  // const loadN = (pa) => {
  //   const n = categories.filter(c => c._id === pa)
  //   return n[0].name
  // }

  const loadSubs = () => {
    getSubs().then(res =>setSubs(res.data))
    console.log(subs);
  }

  

  const handleSubmit = (e) => {
    e.preventDefault()

    createSub({name,parent:category},user.token)
    .then(res => {
      console.log(res);
      setLoading(false)
      toast.success(`${res.data.name} is created!`)
      loadSubs()
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
      if(err.status === 400) toast.error(err.data)
      toast.error('Create failed!')
    })
  }

  const handleRemove = async (slug) => {
    // const answer = window.confirm(`You really want to delete this category '${slug}'?`)
    if(window.confirm(`You really want to delete this category '${slug}'?`)) {
      setLoading(true)
      deleteSub(slug,user.token)
      .then(res => {
        setLoading(false)
        toast.info(`'${res.data.name} have been deleted!'`)
        loadSubs()
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
          : <h3>Create new Sub category</h3>
          }

          <div className='form-group'>
            <label>Parent Category</label>
            <select 
              name="category" 
              className='form-control'
              onChange ={e => setCategory(e.target.value)}
            >
              <option>Please select</option>
              {categories.length > 0 && categories.map(c => {
                return <option key={c._id} value={c._id}>{c.name}</option>
              })}

            </select>
          </div>

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
          {subs.filter(searched(keyword)).map(c => (
            <div 
              className ="alert alert-secondary" 
              key ={c._id}>
                {c.name}
              <span onClick ={()=>handleRemove(c.slug)} style={{float:'right'}} className="btn btn-sm float-right">
                <DeleteOutlined className="text-danger"/>
              </span> 
              
              <Link style={{float:'right'}} className="btn btn-sm float-right" to={`/admin/sub/${c.slug}`}>
                <EditOutlined className="text-primary"/>
              </Link>
            </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default SubCreate
