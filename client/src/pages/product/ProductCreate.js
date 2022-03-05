import React, { useEffect, useState } from 'react'
import AdminNav from '../../component/nav/AdminNav'
import { useSelector } from 'react-redux'
import { createProduct } from '../../functions/product'
import { getCategories,getCategorySubs } from '../../functions/category'
import { toast } from 'react-toastify'
import {LoadingOutlined} from '@ant-design/icons'
import ProductCreateForm from '../../component/form/ProductCreateForm'
import FileUpload from '../../component/form/FileUpload'

const initialState = {
  title:'Macbook PRO',
  description:'Macbook from Apple',
  price:'4000',
  categories:[],
  category:'',
  subs:[],
  shipping:'Yes',
  quantity:'40',
  images:[],
  colors:['Black','Brown','Silver','White','Blue'],
  brands:['Apple','Samsung','Microsoft','ASUS','Lenovo'],
  color:'Black',
  brand:'Apple',
}

const ProductCreate = () => {
  const [values,setValues] = useState(initialState)
  const [subOptions,setSubOptions] = useState([])
  const [showSub,setShowSub] = useState(false)
  const [loading,setLoading] = useState(false)

  const {user} = useSelector(state => ({...state}))

  useEffect(()=> {
    const loadCategories = () => {
      getCategories().then(res => setValues({...values,categories:res.data}))
      
    }
    loadCategories()
    
  },[values])

  const handleSubmit = e => {
    e.preventDefault()
    createProduct(values,user.token)
    .then(res=>{
      console.log(res);
      toast.success(`${res.data.title} has been created!`)
      window.alert(`${res.data.title} has been created!`)
      window.location.reload()
    })
    .catch(err=>{
      console.log(err);
      if(err.response.status === 400) toast.error(err.response.data)
      toast.error(err.response.data.error)
    })
  }

  const handleChange = e => {
    setValues({...values,[e.target.name]:e.target.value})
  }

  const handleCategoryChange = e => {
    e.preventDefault()
    console.log(e.target.value);
    setValues({...values,subs:[],category:e.target.value})
    getCategorySubs(e.target.value)
    .then(res => {
      console.log('Sub options on category click',res);
      setSubOptions(res.data)
    })
    setShowSub(true)
  }

  return (
    <div className ="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? <LoadingOutlined className='text-danger'/> : <h4 >Product Create</h4>}
          <hr />
          {/* {JSON.stringify(values.images)} */}
          <div className="p-3">
            <FileUpload 
              values={values} 
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <ProductCreateForm 
            handleSubmit = {handleSubmit} 
            handleChange = {handleChange}
            values = {values}
            handleCategoryChange = {handleCategoryChange}
            subOptions = {subOptions}
            showSub = {showSub}
            setValues = {setValues}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductCreate