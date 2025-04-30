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
            managerId:req.user._id
        })

        const savedTurf = await newTurf.save();
        res.status(201).json({message:"Turf created successfully", turf:savedTurf});


    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json( error.message || "Internal server error")
    }
}


const updateTurf = async (req, res) => {
    try {
      const { turfId } = req.params;
      const { name, location, price, slots, amenities, existingImages = [] } = req.body;
  
      const isTurfExist = await turfModel.findById(turfId);
      if (!isTurfExist) {
        return res.status(404).json({ error: "Turf not found" });
      }
  
      // Parse location safely
      let parsedLocation;
      try {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (err) {
        return res.status(400).json({ error: "Invalid location format" });
      }
  
      // Handle images
      let uploadedImages = [];
      if (req.files && req.files.length > 0) {
        uploadedImages = await Promise.all(
          req.files.map(file => uploadToCloudinary(file.path))
        );
      }
  
      // Decide final image set: use new if uploaded, else use existingImages
      const finalImages = uploadedImages.length > 0 ? uploadedImages : existingImages;
  
      const updatedTurf = await turfModel.findByIdAndUpdate(
        turfId,
        {
          name,
          location: parsedLocation,
          price,
          slots: slots ? slots.split(",") : isTurfExist.slots,
          amenities: amenities ? amenities.split(",") : isTurfExist.amenities,
          images: finalImages,
        },
        { new: true }
      );
  
      return res.status(200).json({
        message: "Turf updated successfully",
        turf: updatedTurf,
      });
    } catch (error) {
      console.error("Update turf error:", error);
      res.status(error.status || 500).json({ error: error.message || "Internal server error" });
    }
  };

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

        res.status(200).json({turf: turfDetails})

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

const searchTurfs = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        const results = await turfModel.find({
            name: { $regex: query, $options: "i" } // Case-insensitive match
        }).limit(10); // Limit results for performance

        res.status(200).json(results);
    } catch (error) {
        console.error("Search error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




module.exports = { createTurf,updateTurf, listTurf, turfDetails, deleteTurf, searchTurfs }