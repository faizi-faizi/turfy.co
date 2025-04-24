const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 4,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user','manager','admin'],
        default:'user'
    }
},{timestamps: true})

const userModel = new mongoose.model("users",userSchema)
module.exports = userModel 