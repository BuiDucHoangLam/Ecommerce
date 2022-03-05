const Category = require('../models/category')
const Product = require('../models/product')
const Sub = require('../models/sub')
const slugify = require('slugify')

exports.create = async (req,res) => {
  try {
    const {name} = req.body
    res.json(await new Category({name,slug:slugify(name)}).save())
  } catch (error) {
    console.log(error);
    res.status(400).send('Create category failed')
  }
}
  
exports.list =  async (req,res) => {
  try {
    const list = await Category.find({}).sort({createdAt:-1}).exec()
    res.json(list)

  } catch (error) {
    console.log(error);
    res.status(400).send('Get list category failed')
  }
}

exports.read = async  (req,res) => {
  try {
    const cate = await Category.findOne({slug:req.params.slug}).exec()
    // res.json(cate)
    const product = await Product.find({category:cate})
    .populate('category')
    .populate('postedBy','_id name') //to select by name
    .exec()
    res.json({
      cate,
      product,
    })
  } catch (error) {
    console.log(error);
    res.status(400).send('Get category failed')
  }
}

exports.update = async  (req,res) => {
  try {
    const {name} = req.body
    const updated = await Category.findOneAndUpdate(
      {slug:req.params.slug},
      {name, slug:slugify(name)},
      {new:true},
    ).exec()
    res.json(updated)
  } catch (error) {
    console.log(error);
    res.status(400).send('Update category failed')
  }
}

exports.remove = async  (req,res) => {
  try {
    const deleted = await Category.findOneAndDelete({slug:req.params.slug}).exec()
    res.json(deleted)
  } catch (error) {
    console.log(error);
    res.status(400).send('Delete category failed')
  }
}

exports.getSubs = (req,res) => {
  Sub.find({parent: req.params._id}).exec((err,subs) => {
    if(err) console.log(err);
    res.json(subs)
  })
}