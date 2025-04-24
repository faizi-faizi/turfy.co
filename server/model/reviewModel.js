const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'users',
        required: true
    },
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'turfs',
        required: true
    },
    rating: {
        type: Number,
        min:1,
        max:5,
        required: true
    },
    comment: {
        type: String,
        trim: true
    }
},{timestamps:true})

const reviewModel = mongoose.model('reviews',reviewSchema)
module.exports = reviewModel