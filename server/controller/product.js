const Product = require('../models/product')
const User = require('../models/User')
const slugify = require('slugify');

exports.create = async(req,res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title)
    const newProduct = await new Product(req.body).save()
    res.json(newProduct)
  } catch (error) {
    console.log(error);
    // res.status(400).send('Create product failed!')
    res.status(400).json({
      error:error.message,
    })
  }
}

exports.listAll = async(req,res) => {
  const products = await Product.find({}) // .populate('category')
    .limit(parseInt(req.params.count))
    .populate('category') // Get entire info category
    .populate('subs') // Get entire info category
    .sort([['createdAt','desc']])
    .exec()
  res.json(products)
  
}

exports.remove = async (req,res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug
    }).exec()
    res.json(deleted)
  } catch (error) {
    console.log(error);
    return res.status(400).send('Product delete failed!')
  }
}

exports.read = async (req,res) => {
  const product = await Product.findOne({slug:req.params.slug})
  .populate('category')
  .populate('subs')
  .exec()
  res.json(product)
}

exports.update = async (req,res) => {
  try {
    if(req.body.title) {
      req.body.slug = slugify(req.body.title)
    }
    const updated = await Product.findOneAndUpdate(
      {slug:req.params.slug},
      req.body,
      {new:true}
    ).exec()
    res.json(updated)
  } catch (error) {
    console.log('update server failed',error);
    // return res.status(400).send('Product update failed!')
    res.status(400).json({
      err:err.message,
    })
  }
}

// exports.list = async (req,res) => {
//   try {
//     // createAt/updateAt/desc/asc,3
//     const {sort,order,limit} = req.body
//     const products = await Product.find({})
//     .populate('category')
//     .populate('subs')
//     .sort([[sort,order]])
//     .limit(limit)
//     .exec()
//     res.json(products)
//   } catch (error) {
//     console.log(error);
//   }
// }


// Pagination
exports.list = async (req,res) => {
  console.table(req.body);
  try {
    // createAt/updateAt/desc/asc,3
    const {sort,order,page} = req.body
    const currPage = page || 1
    const perPage = 3

    const products = await Product.find({})
    .skip((currPage - 1) * perPage)
    .populate('category')
    .populate('subs')
    .sort([[sort,order]])
    .limit(perPage)
    .exec()
    res.json(products)
  } catch (error) {
    console.log(error);
  }
}

exports.productsCount = async (req,res) => {
  const total = await Product.find({}).estimatedDocumentCount().exec()
  res.json(total)
}

exports.productStar = async (req,res) => {
  const product = await Product.findById(req.params.productId).exec()
  const user = await User.findOne({email:req.user.email}).exec()
  const {star} = req.body
  // who is updating?
  // check if currently logged in user have already added rating to this product
  let existingRatingObject = product.ratings.find(ele => ele.postedBy.toString() === user._id.toString())

  // If user haven't left rating yet, push it
  if(existingRatingObject === undefined) {
    let ratingAdded = await Product.findByIdAndUpdate(product._id,{
      $push: {ratings: {star:star,postedBy:user._id}}, 
    },{new:true}).exec()
    console.log('ratingAdded',ratingAdded);
    res.json(ratingAdded)
  }else {
    const ratingUpdated = await Product.updateOne({
      ratings:{$elemMatch:existingRatingObject},
    },{$set:{'ratings.$.star':star}},{new:true}).exec()
    console.log('ratingUpdated',ratingUpdated);
    res.json(ratingUpdated)
  }
}

exports.listRelated = async (req,res) => {
  const product =await Product.findById(req.params.productId).exec()

  const related = await Product.find({
    _id: {$ne: product._id},
    category: product.category,
  })
  .limit(3)
  .populate('category')
  .populate('subs')
  .populate('postedBy')
  .exec()

  res.json(related)
}

// Search / Filter
const handleQuery = async (req,res,query) => {
  const product = await Product.find({$text:{$search:query}})
  .populate('category','_id name')
  .populate('subs','_id name')
  .populate('postedBy','_id name')
  .exec()

  res.json(product)
}

const handlePrice = async (req,res,price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1]
      },
    })
    .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec()
    res.json(products)
  } catch (error) {
    console.log(error);
  }
}

const handleCategory = async (req,res,category) => {
  try {
    const products = await Product.find({category})
    .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec()

    res.json(products)
  } catch (error) {
    console.log(error);
  }
}

const handleStar = (req,res,stars) => {
  Product.aggregate([
    {
      $project: {
        document: '$$ROOT', // access  to entire project
        // title: '$title',
        // description: '$description',
        // averageRating: ''
        floorAverage: {
          $floor: {$avg: '$ratings.star'}
        }
      }
    },
    {
      $match: {
        floorAverage: stars
      }
    }
  ])
  .limit(12)
  .exec((err,aggregates) => {
    if(err) console.log('AGGREGATE ERROR', err);
    Product.find({_id:aggregates})
    .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec((err,products) => {
      if(err) console.log('PRODUCT AGGREGATE ERROR',err);
      res.json(products)
    })

  })
}

const handleSub = async (req,res,sub) => {
  const products = await Product.find({subs:sub})
    .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec()
  res.json(products)
}

const handleShipping = async (req,res,shipping) => {
  const products = await Product.find({shipping})
  .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec()
  res.json(products)
}

const handleColor = async (req,res,color) => {
  const products = await Product.find({color})
  .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec()
  res.json(products)
}

const handleBrand= async (req,res,brand) => {
  const products = await Product.find({brand})
  .populate('category','_id name')
    .populate('subs','_id name')
    .populate('postedBy','_id name')
    .exec()
  res.json(products)
}

exports.searchFilters = async (req,res) => {
  const {query,price,category,stars,sub,shipping,color,brand} = req.body
  if(query) {
    console.log('query',query);
    await handleQuery(req,res,query)
  }

  if(price !== undefined) {
    console.log('price',price);
    await handlePrice(req,res,price)
  }

  if(category) {
    console.log('category',category);
    await handleCategory(req,res,category)
  }

  if(stars) {
    console.log('star',stars);
    await handleStar(req,res,stars)
  }

  if(sub) {
    console.log('Sub',sub);
    await handleSub(req,res,sub)
  }

  if(shipping) {
    console.log('shipping',shipping);
    await handleShipping(req,res,shipping)
  }

  if(color) {
    console.log('color',color);
    await handleColor(req,res,color)
  }

  if(brand) {
    console.log('brand',brand);
    await handleBrand(req,res,brand)
  }
}