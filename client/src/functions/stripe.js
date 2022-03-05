import axios from "axios";

export const createPaymentIntent = (authtoken,coupon) => {
  return axios.post(`${process.env.REACT_APP_API}/create-payment-intent`,{couponApplied:coupon},{
    headers:{
      authtoken
    }
  })
}