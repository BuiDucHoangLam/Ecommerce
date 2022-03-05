const admin = require('../firebase')
const User = require('../models/User')

exports.authCheck = async (req,res,next) => {
  // console.log(req.headers); // token
  try {
    const firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken)
    // console.log('Firebase user in auth check',firebaseUser);
    req.user = firebaseUser
    next()
  } catch (error) {
    res.status(401).json({
      error:'Invalid or expired token'
    })
  }
  
}

exports.adminCheck = async (req,res,next) => {
  const {email} = req.user

  const adminUser = await User.findOne({email}).exec()

  if(adminUser.role !== 'admin') {
    res.status(403).json({
      err:'Admin resource. Access denies!'
    })
  } else {
    next()
  }
}
