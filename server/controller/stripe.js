const User = require('../models/User')
const Cart = require('../models/cart')
const Product = require('../models/product')
const Coupon = require('../models/coupon')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

exports.createPaymentIntent = async (req,res) => {
  // later apply coupon
  const {couponApplied} = req.body
  // later calculate price
  
  // 1. Find user
  const user = await User.findOne({email:req.user.email}).exec()
  
  // 2. Get user cart total
  const {cartTotal,totalAfterDiscount} = await Cart.findOne({orderBy:user._id}).exec()

  let finalAmount = 0
  if(couponApplied && totalAfterDiscount) {
    finalAmount = Math.round(totalAfterDiscount * 100)
    // finalAmount = totalAfterDiscount
  } else {
    finalAmount = Math.round(cartTotal * 100)
  }
  // 3. Create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount:finalAmount, // cen
    currency:'usd'
  })

  res.send({
    clientSecret:paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount
  })
}