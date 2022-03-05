const express = require('express')

const router = express.Router()

const { authCheck } = require('../middleware/auth')
const {userCart,getUserCart,emptyCart,saveAddress,applyCouponToUserCart,createOrder,createCashOrder,getOrders,addToWishList,wishlist,removeFromWishList} = require('../controller/user')


router.post('/user/cart',authCheck,userCart)
router.get('/user/cart',authCheck,getUserCart)
router.delete('/user/cart',authCheck,emptyCart)
router.post('/user/address',authCheck,saveAddress)

// order
router.post('/user/order',authCheck,createOrder) // stripe
router.post('/user/cash-order',authCheck,createCashOrder) // cod
router.get('/user/order',authCheck,getOrders)

router.post('/user/wishlist',authCheck,addToWishList)
router.get('/user/wishlist',authCheck,wishlist)
router.put('/user/wishlist/:productId',authCheck,removeFromWishList)

// coupon
router.post('/user/cart/coupon',authCheck,applyCouponToUserCart)

// router.get('/user',(req,res) => {
//   res.json({
//     data:'hey you hit user API endpoint'
//   })
// })

module.exports = router