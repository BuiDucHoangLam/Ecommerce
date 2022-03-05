const User = require('../models/User')
const Product = require('../models/product')
const Cart = require('../models/cart')
const Coupon = require('../models/coupon')
const Order = require('../models/order')
const uniqueid = require('uniqueid')

exports.userCart = async (req,res) => {
  console.log(req.body); // {cart:[]}
  const {cart} = req.body
  console.log('cart',cart);
  let products = []
  
  const user = await User.findOne({email:req.user.email}).exec()

  // check if cart with logged in user id already exist
  let cartExistByThisUser = await Cart.findOne({orderBy:user._id}).exec()

  if(cartExistByThisUser) {
    cartExistByThisUser.remove()
    console.log('removed old cart');
  }

  for(let i = 0;i<cart.length;i++) {
    let object = {}
    object.product = cart[i]._id
    object.count = cart[i].count
    object.color = cart[i].color
    // Get price for creating total
    // let {price} = await Product.findById(cart[i]._id).select('price').exec() Gay loi 'Cannot destructure property products of undefined or null'
    let productFromDb = await Product.findById(cart[i]._id).select('price').exec()
    object.price = productFromDb.price

    products.push(object)

    console.log('products',products);
  }

  let cartTotal = 0
  for(let i = 0;i<products.length;i++){
    cartTotal = cartTotal + products[i].price * products[i].count
  }
  console.log('cartTotal',cartTotal);

  let newCart = await new Cart({
    products,
    cartTotal,
    orderBy:user._id
  }).save()

  console.log('new cart',newCart);
  res.json({ok:true})
}

exports.getUserCart = async (req,res) => {
  const user = await User.findOne({email:req.user.email}).exec()

  let cart = await Cart.findOne({orderBy: user._id})
  .populate('products.product','_id title price totalAfterDiscount')
  .exec()
  // console.log('cart',cart);
  // if(cart){
    const {products,cartTotal,totalAfterDiscount} = cart
    res.json({products,cartTotal,totalAfterDiscount})
  // } else {
  //   res.json('cart is null')
  // }
  
}

exports.emptyCart = async (req,res) => {
  const user = await User.findOne({email:req.user.email}).exec()

  const cart = await Cart.findOneAndRemove({orderBy:user._id}).exec()
  res.json(cart)
}

exports.saveAddress = async (req,res) => {
  const userAddress = await User.findOneAndUpdate({email:req.user.email},{address:req.body.address}).exec()

  res.json(userAddress)
}

exports.applyCouponToUserCart = async (req,res) => {
  const {coupon} = req.body
  const validCoupon = await Coupon.findOne({name: coupon}).exec()

  if(validCoupon === null) {
    return res.json({
      err:'Invalid coupon',
    })
  }
  const user = await User.findOne({email:req.user.email}).exec()
  let {products,cartTotal} = await Cart.findOne({orderBy: user._id}).populate('products.product','_id title price').exec()
  let totalAfterDiscount = (cartTotal - (cartTotal*validCoupon.discount)/100).toFixed(2)

  Cart.findOneAndUpdate(
    {orderBy:user._id},
    {totalAfterDiscount},
    {new:true}
  ).exec()

  res.json(totalAfterDiscount)
}

exports.createOrder = async (req,res) => {
  const {paymentIntent} = req.body.stripeResponse
  const user  = await User.findOne({email:req.user.email}).exec()

  let {products} = await Cart.findOne({orderBy:user._id}).exec()

  let newOrder = await new Order({
    products,
    paymentIntent,
    orderBy:user._id
  }).save()

  // decrement quantity, increment sold
  let bulkOption = products.map(p => {
    return {
      updateOne: {
        filter: {_id:p.product._id}, // Important item.product
        update: {$inc: {quantity: -p.count, sold: +p.count}}
      },
    }
  })

  let updated = await Product.bulkWrite(bulkOption,{})
  console.log('Product update quantity', updated);

  res.json(newOrder)
}

exports.createCashOrder = async (req,res) => {
  const {cod,couponApplied} = req.body

  // Can set declare paymentIntent here
  // let paymentIntent = {
  //   id:uniqueid(),
  //   amount:
  // }

  // if cod is true, create order with status of Cash or Delivery
  if(!cod) return res.status(400).send('Create cash order failed!')
  
  const user  = await User.findOne({email:req.user.email}).exec()

  let userCart = await Cart.findOne({orderBy:user._id}).exec()

  let finalAmount = 0

  if(couponApplied && userCart.totalAfterDiscount) {
    finalAmount = userCart.totalAfterDiscount * 100
  } else {
    finalAmount = userCart.cartTotal * 100
  }

  let newOrder = await new Order({
    products:userCart.products,
    paymentIntent:{
      id:uniqueid(),
      amount:finalAmount,
      currency:'usd',
      status:'Cash On Delivery',
      created: Date.now(),
      payment_method_types: ['cash'],
    },
    orderBy:user._id,
    orderStatus: 'Cash On Delivery',
  }).save()

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map(p => {
    return {
      updateOne: {
        filter: {_id:p.product._id}, // Important item.product
        update: {$inc: {quantity: -p.count, sold: +p.count}}
      },
    }
  })

  let updated = await Product.bulkWrite(bulkOption,{})
  console.log('Product update quantity', updated);

  res.json(newOrder)
}

exports.getOrders = async (req,res) => {
  const user = await User.findOne({email:req.user.email}).exec()

  const userOrders = await Order.find({orderBy:user._id})
  .populate('products.product')
  .exec()

  res.json(userOrders)
}

// addToWishList,wishlist,removeFromWishList
exports.addToWishList = async (req,res) => {
  const {productId} = req.body
  // $addToSet to make sure that don't have duplicate in array
  const user = await User.findOneAndUpdate(
    {email:req.user.email},
    {$addToSet:{wishlist:productId}},
    {new:true})
    .exec()

  res.json(user)
}

exports.wishlist = async (req,res) => {
  const list = await User.findOne({email:req.user.email})
  .select('wishlist') // just chose wishlist
  .populate('wishlist')
  .exec()

  res.json(list)
}

exports.removeFromWishList = async (req,res) => {
  const {productId} = req.params
  const user = await User.findOneAndUpdate(
    {email:req.user.email},
    {$pull:{wishlist:productId}},
    {new:true}, // if res.json({ok:true}) so don't need this option
    )
  .exec()

  res.json({user})
}