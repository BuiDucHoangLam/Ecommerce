const cloudinary = require('cloudinary')

// Config
cloudinary.config({
  cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
  api_key:process.env.CLOUDINARY_CLOUD_KEY,
  api_secret:process.env.CLOUDINARY_CLOUD_SECRET,
})

// req.files.file.path
exports.upload = async (req,res) => {
  const rs = await cloudinary.uploader.upload(req.body.image,{
    public_id:`${Date.now}`,
    resource_type:'auto' //jpeg,png
  })
  res.json({
    public_id:rs.public_id,
    url:rs.secure_url,
  })
}

exports.remove = (req,res) => {
  const image_id = req.body.public_id 
  cloudinary.uploader.destroy(image_id,(err,rs)=>{
    if(err) return res.json({
      success:false,err
    })
    res.send('ok')
  })
}