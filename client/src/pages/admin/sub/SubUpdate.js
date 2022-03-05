import React, { useEffect, useState } from 'react'
import AdminNav from '../../../component/nav/AdminNav'
import { useSelector } from 'react-redux'
import { getCategories } from '../../../functions/category'
import { updateSub,getSub } from '../../../functions/sub'
import { toast } from 'react-toastify'

import CategoryForm from '../../../component/form/CategoryForm'

const SubUpdate = ({history,match}) => {
  const [name,setName] = useState('')
  const [loading,setLoading] = useState(false)
  const [categories,setCategories] = useState([])
  const [parent,setParent] = useState('')

  console.log(parent);
  const {user} = useSelector(state => ({...state}))
  const {slug} = match.params

  useEffect(()=>{
    const loadSub = () => {
      getSub(slug).then(res => {
        setName(res.data.name)
        setParent(res.data.parent)
      })
  
    }
    loadCategories()
    loadSub()
  },[slug])

  

  const loadCategories = () => {
    getCategories().then(res =>setCategories(res.data))
  }

  const interval = () => {
    setTimeout(()=>history.push('/admin/sub'),3000)
    
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    updateSub(slug,{name,parent},user.token)
    .then(res => {
      setLoading(false)
      toast.success(`Update success with new name: ${res.data.name}!`)
     
      interval()
      
    })
    .catch(err => {
      setLoading(false)
      toast.error('Update error!',err)
    })
  }

  
  const handleReset = (e) => {
    e.preventDefault()
    setName(match.params.slug)
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
          <div className='form-group'>
            <label>Parent Category</label>
            {/* <Select 
              name="category"
              // className='form-control'
              // onChange={e=>setCategory(e.target.value)}
              options = {categories}
            /> */}
            <select 
              name="category" 
              className='form-control'
              onChange ={e => setParent(e.target.value)}
              value={parent}
            >
              {/* <option>Select below</option> */}
            
              {categories.length > 0 && categories.map(c => {
                  if(c._id === parent) 
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  return <option key={c._id} value={c._id}>
                    {c.name}
                  </option>             
                }
              )}

            </select>
          </div>
          <CategoryForm
            onSubmit = {handleSubmit}
            name = {name}
            change = {setName}
            functionality = 'Update now'
          />
          <button onClick ={handleReset} type="submit" className="btn btn-raised">
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default SubUpdate
