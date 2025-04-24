const turfModel = require("../model/turfModel");
const uploadToCloudinary = require('../utilities/imageUpload')

const createTurf = async (req,res)=>{
    try {
        if(req.user.role !== 'manager'){
            return res.status(403).json({message:"Access denied, only managers can create turfs"})
        }

        const {name,location,price,slots,amenities}= req.body;
        if(!name|| !location || !price || !slots || !amenities){
            return res.status(400).json({message:"all fields are required"})
        }


        if(!req.files || req.files.length===0){
            return res.status(400).json({message:"at least one image is required"})
        }
        
        const parsedLocation = JSON.parse(location)

        const cloudinaryRes = await Promise.all(
            req.files.map(file => uploadToCloudinary(file.path)) 
        );

        const newTurf = new turfModel({
            name,
            location:parsedLocation,
            price,
            slots:slots.split(","),
            amenities:amenities.split(","),
            images:cloudinaryRes,
            managerId:req.user.id
        })

        const savedTurf = await newTurf.save();
        res.status(201).json({message:"Turf created successfully", turf:savedTurf});


    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json( error.message || "Internal server error")
    }
}


const updateTurf = async(req,res)=>{
    try{
        const {turfId} = req.params;
        const {name,location,price,slots,amenities} = req.body
        let imageUrl;
        let cloudinaryRes = [];

        let isTurfExist = await turfModel.findById(turfId)

        if(!isTurfExist){
            return res.status(400).json({error:"Turf not found"})
        }

        let parsedLocation = isTurfExist.location;
        if (location) {
            try {
                parsedLocation = JSON.parse(location);
            } catch (err) {
                return res.status(400).json({ error: "Invalid location format" });
            }
        }


        if(req.file && req.file.length>0){
                const cloudinaryRes = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.path)) 
            );
            imageUrl = cloudinaryRes
        }

        const updatedTurf = await turfModel.findByIdAndUpdate(turfId,{name,
        location:parsedLocation,
        price,
        slots: slots ? slots.split(",") : isTurfExist.slots,
        amenities:amenities? amenities.split(","): isTurfExist.amenities,
        images:cloudinaryRes,
        image:imageUrl}, {new:true})

        return res.status(200).json({ message: "Turf updated successfully", turf: updatedTurf });

    } catch(error){
        console.log(error)
        res.status(error.status || 500).json(error.message || "internal server error")
    }
}


const listTurf = async(req,res)=>{
    try {
        const turfList = await turfModel.find();
        res.status(200).json(turfList)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const turfDetails = async(req,res)=>{
    try {
        const { turfId } = req.params;
        
        const turfDetails = await turfModel.findById(turfId)
        if(!turfDetails){ 
           return res.status(400).json({error:"Turf not found"})
        }

        res.status(200).json(turfDetails)

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || "Internal server error" );
    }
}


const deleteTurf = async(req, res)=>{
    try {
        const {turfId} = req.params
        const deleteTurf = await turfModel.findByIdAndDelete(turfId)

        if(!deleteTurf){
            return res.status(400).json({message:"Turf not found"})
        }

        res.status(200).json({message:"Turf Deleted"})

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { createTurf,updateTurf, listTurf, turfDetails, deleteTurf }