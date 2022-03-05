const express = require('express')
const router = express.Router()

const {create,list,read,update,remove,readId} = require('../controller/sub')
const { authCheck,adminCheck } = require('../middleware/auth')

router.post('/sub',authCheck,adminCheck,create)
router.get('/sub',list)
router.get('/sub/:slug',read)
router.get('/sub-id/:id',readId)
router.put('/sub/:slug',authCheck,adminCheck,update)
router.delete('/sub/:slug',authCheck,adminCheck,remove)

module.exports = router