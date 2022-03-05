const express = require('express')

const router = express.Router()

const { authCheck,adminCheck } = require('../middleware/auth')

const {orders,orderStatus} = require('../controller/admin')

// router
router.get('/admin/orders',authCheck,adminCheck,orders)
router.put('/admin/order-status',authCheck,adminCheck,orderStatus)


module.exports = router