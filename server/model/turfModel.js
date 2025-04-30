const mongoose = require('mongoose')

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 4,
        required: true
    },
    location: {
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        pincode:{
            type: Number,
            required: true
        }
    },
    price: {
        type: Number,
        required: true
    },
    slots: {
        type: [String]
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    images:[String],
    amenities:[String],
    reviews: [{                     
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
},{timestamps: true})

const turfModel = new mongoose.model("turfs",turfSchema)
module.exports = turfModel