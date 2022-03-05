const express = require('express')

const router = express.Router()

// middleware
const {authCheck,adminCheck} = require('../middleware/auth')

// import controller
const {createOrUpdateUser,currentUser} = require('../controller/auth')

const myMiddleware = (req,res,next) => {
  console.log('Im a middleware');
  next()
}

router.post('/create-or-update-user',authCheck,createOrUpdateUser)
router.post('/current-user',authCheck,currentUser)
router.post('/current-admin',authCheck,adminCheck,currentUser)

router.get('/testing',myMiddleware,(req,res) => {
  res.json({
    data:'you successfully tried middleware'
  })
})

module.exports = router