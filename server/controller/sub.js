const Sub = require('../models/sub')
const Product = require('../models/product')
const slugify = require('slugify')

exports.create = async (req,res) => {
  try {
    const {name,parent} = req.body
    res.json(await new Sub({name,slug:slugify(name),parent}).save())
  } catch (error) {
    console.log('Create error',error);
    res.status(400).send('Create Sub failed')
  }
}
  
exports.list =  async (req,res) => {
  try {
    const list = await Sub.find({}).sort({createdAt:-1}).exec()
    res.json(list)

  } catch (error) {
    console.log(error);
    res.status(400).send('Get list Sub failed')
  }
}

exports.read = async  (req,res) => {
  try {
    const subs = await Sub.findOne({slug:req.params.slug}).exec()
    const product = await Product.find({subs:subs})
    .populate('category')
    .exec()
    res.json({
      subs,
      product
    })
    // res.json(subs)
  } catch (error) {
    console.log(error);
    res.status(400).send('Get Sub failed')
  }
}

exports.readId = async (req,res) => {
  try {
    const {_id,name,parent} = req.body
    console.log(req.params.slug);
    console.log(req.params);
    console.log(req.body);
    console.log(req.body._id);
    const cate = await Sub.findOne({name:req.params.name}).exec()
    res.json(cate)
  } catch (error) {
    console.log(error);
    res.status(400).send('Get Sub failed')
  }
}

exports.update = async  (req,res) => {
  try {
    const {name,parent} = req.body
    const updated = await Sub.findOneAndUpdate(
      {slug:req.params.slug},
      {name,parent, slug:slugify(name)},
      {new:true},
    ).exec()
    res.json(updated)
  } catch (error) {
    console.log(error);
    res.status(400).send('Update Sub failed')
  }
}

exports.remove = async  (req,res) => {
  try {
    const deleted = await Sub.findOneAndDelete({slug:req.params.slug}).exec()
    res.json(deleted)
  } catch (error) {
    console.log(error);
    res.status(400).send('Delete Sub failed')
  }
}