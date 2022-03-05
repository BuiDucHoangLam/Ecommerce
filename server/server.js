const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const {readdirSync} = require('fs')
require('dotenv').config()

// import routes
// const authRoutes = require('./routes/auth')

// App
const app = express()

// Db
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useFindAndModify:false,
  useUnifiedTopology:true,
})
.then(()=> console.log('DB connect success'))
.catch(err => console.log('DB connect error',err))

// Middleware
app.use(morgan('dev'))
app.use(bodyParser.json({limit:'2mb'}))
app.use(cors())

// Routes middleware
// app.use('/api',authRoutes)
// To not necessary to import everything in routes
readdirSync('./routes')
.map(r=> 
  app.use('/api',require('./routes/' + r))
)
// Route
// app.get('/api',(req,res) => {
//   res.json({
//     data:'hey you hit node API'
//   })
// })

// Port
const port= process.env.PORT || 8000
app.listen(port,()=>console.log(`Server is running on port ${port}`))