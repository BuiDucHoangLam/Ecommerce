import axios from 'axios'

export const getProductByCount = async (count) => {
  return await axios.get(`${process.env.REACT_APP_API}/products/${count}`)
}

export const getProduct = async (slug) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/${slug}`)
}

export const getProducts = async (sort,order,page) => {
  return await axios.post(`${process.env.REACT_APP_API}/products`,{
    sort,order,page,
  })
}

export const createProduct = async (product,authtoken) => 
  await axios.post(`${process.env.REACT_APP_API}/product`,product,{
    headers:{
      authtoken,
    }
  })


export const updateProduct = async (slug,product,authtoken) => {
  return await axios.put(`${process.env.REACT_APP_API}/product/${slug}`,product,{
    headers:{
      authtoken
    }
  })
}

export const deleteProduct = async (slug,authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API}/product/${slug}`,{
    headers:{
      authtoken
    }
  })
}

export const getProductsCount = async () => {
  return await axios.get(`${process.env.REACT_APP_API}/products/total`)
} 

export const productStar = async (productId,star,authtoken) => {
  return await axios.put(`${process.env.REACT_APP_API}/product/star/${productId}`,{star},{
    headers:{
      authtoken
    }
  })
}

export const getRelated = async (productId) => {
  return await axios.get(`${process.env.REACT_APP_API}/product/related/${productId}`)
}

export const fetchProductsByFilter = async (arg) => {
  return await axios.post(`${process.env.REACT_APP_API}/search/filters`,arg)
}