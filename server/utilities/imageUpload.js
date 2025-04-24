const cloudinary = require("../config/cloudinayConfig")

const uploadToCloudinary = (filepath)=>{
    return new Promise((resolve,reject)=>{
        cloudinary.uploader.upload(
            filepath,
            { folder: 'turfs' },
            (error,result)=>{
                if(error) return reject(error)
                resolve(result.secure_url)
            }
        )
    })
}

module.exports = uploadToCloudinary