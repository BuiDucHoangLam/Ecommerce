const Order = require('../models/order')

exports.orders = async (req,res) => {
  const orders = await Order.find({})
  .sort('-createAt')
  .populate('products.product')
  .exec()

  res.json(orders)
}

exports.orderStatus = async (req,res) => {
  const {orderId,orderStatus} = req.body
  const updated =await Order.findByIdAndUpdate(orderId,{orderStatus},{new:true})
  .exec()

  res.json(updated)
}
