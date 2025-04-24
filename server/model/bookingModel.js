const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    turfId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'turfs',
        required:'true'
    },
    managerId:{
        type:mongoose.Schema.Types.ObjectId,ref:'users'
    },
    date:{
        type:Date,
        required:true
    },
    slot:{
        type:String,
        required:true
    },
    price: {
        type:Number,
        required:true
    }, 
    status:{
        type:String,
        enum: ['pending','confirmed','cancelled'],
        default:'pending'
    },
    paymentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'payments'
    }
},{timestamps:true})

const bookingModel = mongoose.model('bookings',bookingSchema)
module.exports = bookingModel