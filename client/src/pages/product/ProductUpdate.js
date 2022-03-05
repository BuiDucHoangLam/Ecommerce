import React, { useEffect, useState } from 'react'
import AdminNav from '../../component/nav/AdminNav'
import { useSelector } from 'react-redux'
import { updateProduct,getProduct } from '../../functions/product'
import { getCategories,getCategorySubs } from '../../functions/category'
import { toast } from 'react-toastify'
import {LoadingOutlined} from '@ant-design/icons'
import ProductUpdateForm from '../../component/form/ProductUpdateForm'
import FileUpload from '../../component/form/FileUpload'

const initialState = {
  title:'',
  description:'',
  price:'',
  category:'',
  subs:[],
  shipping:'',
  quantity:'',
  images:[],
  colors:['Black','Brown','Silver','White','Blue'],
  brands:['Apple','Samsung','Microsoft','ASUS','Lenovo'],
  color:'',
  brand:'',
}

const ProductUpdate = ({match,history}) => {
  const [values,setValues] = useState(initialState)
  const [categories,setCategories] = useState([])
  const [subOptions,setSubOptions] = useState([])
  const [loading,setLoading] = useState(false)
  const [arrayOfSubIds,setArrayOfSubIds] = useState([])
  const [selectedCategory,setSelectedCategory] = useState('')

  const {user} = useSelector(state => ({...state}))
  const {slug} = match.params 

  useEffect(()=> {
    const loadCategories = () => {
      getCategories().then(res =>{
        console.log(res.data);
        setCategories(res.data)
        })
      console.log(categories);
    }
    const loadProduct = () => {
      // Load single product
      getProduct(slug)
      .then(p => {
        setValues({...values,...p.data})
      // Load single product category subs
        getCategorySubs(p.data.category._id).then(c=>{
          setSubOptions(c.data)
        })
      // Prepare array of sub to show as default sub values in antd Select
      let arr = []
      p.data.subs.map(s => {
        arr.push(s._id)
      })
      console.log('Arr',arr);
      setArrayOfSubIds(() => arr) // required for ant design select to work
      
      })
      .catch(err => {
        console.log(err);
      })
    }
    loadCategories()
    loadProduct()
  },[categories,slug,values])

  const loadProduct = () => {
    // Load single product
    getProduct(slug)
    .then(p => {
      setValues({...values,...p.data})
    // Load single product category subs
      getCategorySubs(p.data.category._id).then(c=>{
        setSubOptions(c.data)
      })
    // Prepare array of sub to show as default sub values in antd Select
    let arr = []
    p.data.subs.map(s => {
      arr.push(s._id)
    })
    console.log('Arr',arr);
    setArrayOfSubIds(() => arr) // required for ant design select to work
    
    })
    .catch(err => {
      console.log(err);
    })
  }

  

  const handleSubmit = e => {
    e.preventDefault()
    setLoading(true)

    values.subs = arrayOfSubIds
    values.category = selectedCategory ? selectedCategory : values.category


    updateProduct(slug,values,user.token)
    .then(res => {
      setLoading(false)
      toast.success(`${res.data.title} is updated`)
      history.push('/admin/products')
    })
    .catch(err => {
      // if(err.response.status === 400) toast.error(err.response.data)
      toast.error(err.response.data.error)
      setLoading(false)
      console.log('update failed',err);
    })
  }

  const handleChange = e => {
    setValues({...values,[e.target.name]:e.target.value})
  }

  const handleCategoryChange = e => {
    e.preventDefault()
    console.log(e.target.value);
    setValues({...values,subs:[]})
    setSelectedCategory(e.target.value)
    getCategorySubs(e.target.value)
    .then(res => {
      console.log('Sub options on category click',res);
      setSubOptions(res.data)
    })

    console.log(values.category,'0',e.target.value);

    // If user clicks back to original category show its sub categories in default
    if(values.category._id === e.target.value){
      loadProduct()
    }
    setArrayOfSubIds([])
  }

  

  return (
    <div className ="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? <LoadingOutlined className='text-danger'/> : <h4 >Product Update</h4>}
          <hr />
          {JSON.stringify(values)}

          <div className="p-3">
            <FileUpload 
              values={values} 
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <ProductUpdateForm
            handleSubmit = {handleSubmit}
            handleChange = {handleChange}
            setValues = {setValues}
            values = {values}
            handleCategoryChange = {handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            selectedCategory={selectedCategory}
            arrayOfSubIds={arrayOfSubIds}
            setArrayOfSubIds={setArrayOfSubIds}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
