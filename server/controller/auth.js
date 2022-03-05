const User = require('../models/User')

exports.createOrUpdateUser = async (req,res) => {
  const {name,picture,email} = req.user

  const user = await User.findOneAndUpdate({email},{name: name ? name : email.split('@')[0],picture},{
    new:true
  })

  if(user) {
    console.log('User updated',user);
    res.json(user)
  } else {
    const newUser = await new User({
      email,name: name ? name : email.split('@')[0],picture,picture,
    }).save()
    console.log('User created',newUser);
    res.json(newUser)
  }
}

exports.currentUser = async (req,res) => {
  User.findOne({email:req.user.email}).exec((err,user) => {
    if(err) throw new Error(err)
    res.json(user)
  })
}