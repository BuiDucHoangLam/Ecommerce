import axios from "axios";

export const userCart = async (cart,authtoken) => {
  return await axios.post(`${process.env.REACT_APP_API}/user/cart`,{cart},{
    headers:{
      authtoken
    }
  })
}

export const getUserCart = async (authtoken) => 
  await axios.get(`${process.env.REACT_APP_API}/user/cart`,{
    headers:{
      authtoken
    }
  })

  export const emptyUserCart = async (authtoken) => 
  await axios.delete(`${process.env.REACT_APP_API}/user/cart`,{
    headers:{
      authtoken
    }
  })

export const saveUserAddress = async (authtoken,address) =>
await axios.post(`${process.env.REACT_APP_API}/user/address`,{address},{
  headers:{
    authtoken
  }
})

export const applyCoupon = async (authtoken,coupon) =>
await axios.post(`${process.env.REACT_APP_API}/user/cart/coupon`,{coupon},{
  headers:{
    authtoken
  }
})

export const createOrder = async (authtoken,stripeResponse) =>
await axios.post(`${process.env.REACT_APP_API}/user/order`,{stripeResponse},{
  headers:{
    authtoken
  }
})

export const getUserOrders = async (authtoken) =>
await axios.get(`${process.env.REACT_APP_API}/user/order`,{
  headers:{
    authtoken
  }
})

export const getWishlist = async (authtoken) =>
await axios.get(`${process.env.REACT_APP_API}/user/wishlist`,{
  headers:{
    authtoken
  }
})

export const addToWishList = async (authtoken,productId) =>
await axios.post(`${process.env.REACT_APP_API}/user/wishlist`,{productId},{
  headers:{
    authtoken
  }
})

export const removeWishlist = async (authtoken,productId) =>
await axios.put(`${process.env.REACT_APP_API}/user/wishlist/${productId}`,{},{
  headers:{
    authtoken
  }
})

export const createCashUserOrder = async (authtoken,cod,coupon) =>
await axios.post(`${process.env.REACT_APP_API}/user/cash-order`,{cod,couponApplied:coupon},{
  headers:{
    authtoken
  }
})