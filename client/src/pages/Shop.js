import React,{useState,useEffect} from 'react'
import { getProductByCount,fetchProductsByFilter } from '../functions/product'
import {getCategories} from '../functions/category'
import {getSubs} from '../functions/sub' 
import { useSelector,useDispatch } from 'react-redux'
import ProductCard from '../component/card/ProductCard'
import { Menu,Slider,Checkbox,Radio } from 'antd'
import { DollarOutlined,DownSquareOutlined, StarOutlined } from '@ant-design/icons'
import Star from '../component/form/Star'

const {SubMenu,Item} = Menu

const Shop = () => {
  const [products,setProducts] = useState([])
  const [loading,setLoading] = useState(false)
  const [price,setPrice] = useState([0,0])
  const [ok,setOk] = useState(false)
  const [categories,setCategories] = useState([])
  const [categoryIds,setCategoryIds] = useState([])
  const [star,setStar] = useState('')
  const [subs,setSubs] = useState([])
  const [sub,setSub] = useState('')
  const [colors,setColors] = useState(['Black','Brown','Silver','White','Blue'])
  const [color,setColor] = useState('')
  const [brands,setBrands] = useState(['Apple','Samsung','Microsoft','ASUS','Lenovo'])
  const [brand,setBrand] = useState('')
  const [shipping,setShipping] = useState('')

  let dispatch = useDispatch()  
  const {search} = useSelector(state => ({...state}))
  const {text} = search

  useEffect(() => {
    loadAllProducts()
    // fetch Categories
    getCategories().then(res => setCategories(res.data))
    // fetch Subcategories
    getSubs().then(res => setSubs(res.data))
  },[])



  // 1. Load products by default on page load
  const loadAllProducts = () => {
    getProductByCount(12).then(p => {
      console.log(p.data);
      setProducts(p.data)
      setLoading(false)
      setSub('')
      setBrand('')
      setColor('')
      setStar('')
      setPrice([0,0])
      setShipping('')
    })
  }

  // 2. Load products on user search input
  const fetchProducts = (arg) => {
    fetchProductsByFilter(arg)
    .then(res => {
      setProducts(res.data)
    })
    .catch(err => {
      console.log(err);
    })
  }

  useEffect(() => {
    // console.log('Load products on user search input',text);
    const delayed = setTimeout(() => {
      fetchProducts({query:text})
      if(!text) {
        loadAllProducts()
      }
    }, 300)
    return () => clearTimeout(delayed)
  },[text])

  // 3. Load products based on price range by show in list checkbox
  useEffect(()=> {
    console.log('OK to request');
    fetchProducts({price})
  },[ok,price])

  const handleSlider = value => {
    dispatch({
      type:'SEARCH_QUERY',
      payload:{text:''}
    })

    // reset
    setCategoryIds([])
    setStar('')
    setPrice(value)
    setSub('')
    setBrand('')
    setColor('')
    setShipping('')
    setTimeout(() => {
      setOk(!ok)
    },300)
  }

  // 4. Load products based on category
  const showCategories = () => categories.map(c =>
    <Checkbox 
      className='pb-2 pl-4 pr-4' 
      key={c._id}
      name = 'category'
      value={c._id}
      onChange={handleCheck}
      checked={categoryIds.includes(c._id)}
      style={{width:'inherit'}}
    >{c.name}
    </Checkbox>
  )

  const handleCheck = e => {
    dispatch({
      type:'SEARCH_QUERY',
      payload:{text:''}
    })
    // reset
    setPrice([0,0])
    setStar('')
    setSub('')
    setBrand('')
    setColor('')
    setShipping('')
    // console.log(e.target.value);
    const inTheState = [...categoryIds]
    const justChecked = e.target.value
    const foundInTheState = inTheState.indexOf(justChecked) // index or -1

    // indexOf method ?? if not found returns -1 else return index
    if(foundInTheState === -1){
      inTheState.push(justChecked)
    } else {
      // if found pull out one item from index
      inTheState.splice(foundInTheState,1)
    }
    setCategoryIds(inTheState)
    // console.log(inTheState);
    fetchProducts({category:inTheState})
  }

  // 5. Show products by stars rate

  const handleStarClick = numb => {
    console.log(numb);
    dispatch({
      type: 'SEARCH_QUERY',
      payload:{text:''},
    })

    // Reset
    setPrice([0,0])
    setCategoryIds([])
    setStar(numb)
    setSub('')
    setBrand('')
    setColor('')
    setShipping('')
    fetchProducts({stars:numb})
  }

  const showStars = () => {
    // return <div className="pr-4 pl-4 pb-2">
    return <>
      <Star starClick={handleStarClick} numberOfStars = {5} />
      <Star starClick={handleStarClick} numberOfStars = {4} />
      <Star starClick={handleStarClick} numberOfStars = {3} />
      <Star starClick={handleStarClick} numberOfStars = {2} />
      <Star starClick={handleStarClick} numberOfStars = {1} />
    </>
  }

  // 6. Show product by subs categories
  const showSubs = () => {
    return subs.map(s=> 
    <Item 
      className='p-1 m-1 badge badge-secondary' 
      key={s._id} 
      style={{cursor:'pointer',backgroundColor:'gray',display: 'inline-block',width:'unset',height:'unset',lineHeight:'.7rem'}} 
      onClick ={() => handleSubmit(s)}>
      {s.name}
    </Item>)
  }

  const handleSubmit = s => {
    setSub(s)
    dispatch({
      type:'SEARCH_QUERY',
      payload:{text:''},
    })
    setPrice([0,0])
    setCategoryIds([])
    setStar('')
    setBrand('')
    setColor('')
    setShipping('')
    fetchProducts({sub:s})
  }

  // 7. Show products by brand
  const showBrand = () => {
    return brands.map(b => <Radio key={b} value ={b} name ={b} checked ={b === brand} className='pb-1 pl-4 pr-4' onChange={handleBrand} style={{width: 'inherit'}}>
      {b}
    </Radio>)
  }

  const handleBrand = (e) => {
    setBrand(e.target.value)
    dispatch({
      type:'SEARCH_QUERY',
      payload:{text:''},
    })
    setPrice([0,0])
    setCategoryIds([])
    setStar('')
    setColor('')
    setShipping('')
    setSub('')
    fetchProducts({brand:e.target.value})
    
  }

  // 8. Show product by color
  const showColor = () => {
    return colors.map(c => <Radio
      key={c}
      name={c}
      value ={c}
      onChange ={handleColor}
      checked ={c === color}
      className='pb-1 pl-4 pr-4'
      style={{width: 'inherit'}}
    >
      {c}
    </Radio>)
  }

  const handleColor = e => {
    setColor(e.target.value)
    dispatch({
      type:'SEARCH_QUERY',
      payload:{text:''},
    })
    setPrice([0,0])
    setCategoryIds([])
    setStar('')
    setBrand('')
    setSub('')
    setShipping('')
    fetchProducts({color:e.target.value})
  }

  // 9. Show product by Shipping
  const showShipping = () => {
    return <>
      <Checkbox
        className ='pb-2 pl-4 pr-4' onChange ={handleShipping} value ='Yes' checked={shipping === 'Yes'}
      >Yes</Checkbox>
      <Checkbox
        className ='pb-2 pl-4 pr-4' onChange ={handleShipping} value ='No' checked={shipping === 'No'}
      >No</Checkbox>
    </>
  }

  const handleShipping = e => {
    setShipping(e.target.value)
    dispatch({
      type:'SEARCH_QUERY',
      payload:{text:''},
    })
    setPrice([0,0])
    setCategoryIds([])
    setStar('')
    setBrand('')
    setSub('')
    setColor('')
    fetchProducts({shipping:e.target.value})
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3">
          <h4>Search / Filter</h4>
          <Menu defaultOpenKeys={['price','category','star','sub','brand','color','shipping']} mode='inline'>
            <SubMenu key="price" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><DollarOutlined/> Price</span>}>
              
                <Slider 
                  className='ml-4 mr-4' 
                  tipFormatter={v => `$${v}`} 
                  range 
                  value={price}
                  onChange={handleSlider}
                  max='10000'
                />
              
            </SubMenu>
            <SubMenu key="category" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><DownSquareOutlined/> Categories</span>}>
              {showCategories()}
            </SubMenu>

            <SubMenu key="star" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><StarOutlined/> Rating</span>}>
               {showStars()} 
            </SubMenu>

            <SubMenu key="sub" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><StarOutlined/> Sub Categories</span>}>
               {showSubs()} 
            </SubMenu>

            <SubMenu key="brand" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><StarOutlined/> Brand</span>}>
               {showBrand()} 
            </SubMenu>

            <SubMenu key="color" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><StarOutlined/> Color</span>}>
               {showColor()} 
            </SubMenu>

            <SubMenu key="shipping" title={<span style={{ marginTop: 0,marginBottom: '0.5rem',fontWeight: 500,lineHeight: 1.2}}><StarOutlined/> Shipping</span>}>
               {showShipping()} 
            </SubMenu>

          </Menu>
        </div>

        <div className="col-md-9 pt-2">
          {loading
          ? <h4 className='text-danger'>Loading...</h4>
          : <h4 className='text-danger'>Products</h4>
          }
          {products.length < 1 ? <p>No products found</p>
          : <div className="row pb-5">
            {products.map(p => {
              
              return <div key= {p._id} className="col-md-4 mt-3">
                <ProductCard product = {p} />
              </div>
            })}
          </div>}
        </div>
      </div>
    </div>
  )
}

export default Shop
