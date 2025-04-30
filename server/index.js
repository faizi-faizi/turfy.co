const express = require('express')
const dbConnection = require('./config/dbConnection')
const userRoutes = require('./routes/userRoutes')
const managerRoutes = require('./routes/managerRoutes')
const adminRoutes = require('./routes/adminRoutes')
const turfRoutes = require('./routes/turfRoutes')
const bookingRoutes = require('./routes/bookingRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const cors = require('cors')
const paymentRoutes = require('./routes/paymentRoutes')
const stripeRouter = require('./routes/stripeWebhook')
require('dotenv').config()

const app = express()


app.get('/',(req,res)=>{
    res.json("server started")
})

dbConnection()

app.use(express.json())  
const allowedOrigins = [
    "http://localhost:5173",
    "https://turfy-co-shxo.vercel.app"
  ]
  
  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }))

//routes
app.use('/user', userRoutes)
app.use('/manager',managerRoutes)
app.use('/admin', adminRoutes)
app.use('/turfs', turfRoutes)
app.use('/bookings',bookingRoutes)
app.use('/reviews',reviewRoutes)
app.use("/payment", paymentRoutes)
app.use("/stripe",stripeRouter)

app.listen(process.env.PORT,(err)=>{
    if(err){
        console.log(err);
    } else{
        console.log(`server starts on port ${process.env.PORT}`);
        
    }
})