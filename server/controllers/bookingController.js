const bookingModel = require("../model/bookingModel");
const turfModel = require("../model/turfModel");
const userModel = require("../model/userModel"); 
const createBooking = async(req,res)=>{
    try {
        const { turfId, date, slot } = req.body;
        
        if(!turfId, !date, !slot ){
            return res.status(400).json({message:"all fields are required"})
        }

        const turf = await turfModel.findById(turfId);
        if(!turf) return res.status(404).json({message:"Turf not found"});

        const existingBooking = await bookingModel.findOne({turfId,date,slot});
        if(existingBooking){
            return res.status(400).json({message:"Slot already booked for the selected date"})
        }

        const booking = new bookingModel({
            userId:req.user.id,
            turfId,
            managerId: turf.managerId,
            date,
            slot,
            price: turf.price,
            status:"pending"
        })

        const savedBooking = await booking.save();
        res.status(201).json({message:"Booking created successfully", booking: savedBooking, bookingId: savedBooking._id })

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Internal server error"})
    }
}

//for users
const editBooking = async(req,res)=>{
    try {
        const {bookingId} = req.params;
        const {date , slot} = req.body;

        const booking = await bookingModel.findById(bookingId);

        if(!booking){
            return res.status(404).json({message: "Booking not found"})
        }

        if(booking.status != "pending"){
            return res.status(400).json({message:"Only pending bookings can be edited"});
        }

        const conflict = await bookingModel.findOne({
            _id : { $ne: bookingId},
            turfId: booking.turfId,
            date,
            slot

        })

        if(conflict){
            res.status(400).json({ message: "Selected slot is already booked"});
        }

        booking.date = date || booking.date;
        booking.slot = slot || booking.slot;

        const updatedBooking = await bookingModel.save();

        res.status(200).json({
            message: "Booking Update successfully",
            booking: updatedBooking
        })

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error")
        
    }
}

//to manage the bookings status by admin/manager
const manageBooking = async (req,res)=>{
    try{
        const { bookingId } = req.params
        const { status } = req.body

        const updatedBooking = await bookingModel.findByIdAndUpdate(bookingId,{status},{new: true})

        if(!updatedBooking){
            return res.status(404).json({message:"Booking not found"})
        }
        
        res.status(200).json({message:"Booking updated", updatedBooking})

        }
        catch{
        console.log(error)
        res.status(error.status || 500).json( error.message || "Internal server error" )
        }
}

//get all bookings (admin only or manager specific)
const getAllBooking = async (req,res)=>{
    try {
        const bookings = await bookingModel.find().populate('userId turfId');
        res.status(200).json(bookings);
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || "Internal server error" );
    }
}

//get single booking
const getBookingById = async (req,res)=>{
    try {
        const { bookingId } = req.params;
        console.log("bookingId from params:", bookingId); 

        const booking = await bookingModel.findById(bookingId).populate('userId turfId');

        if(!booking){
            return res.status(404).json({error:"Booking not found"})
        }

        res.status(200).json(booking)

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || "Internal server error" );
    }
}

//get user-specific bookings
const getUserBookings = async (req,res)=>{
    try {
        const userId = req.user.id;
        const bookings = await bookingModel.find({userId}).populate('turfId');

        res.status(200).json(bookings);

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || "Internal server error" );
    }
}


module.exports = { createBooking, editBooking,manageBooking, getAllBooking, getBookingById, getUserBookings }
