
const bookingModel = require("../model/bookingModel");
const turfModel = require("../model/turfModel");
const createBooking = async(req,res)=>{
    try {
        const { turfId, date, slot } = req.body;
        
        if(!turfId || !date || !slot ){
            return res.status(400).json({message:"all fields are required"})
        }

        const turf = await turfModel.findById(turfId);
        if(!turf) return res.status(404).json({message:"Turf not found"});

        const existingBooking = await bookingModel.findOne({turfId,date,slot});
        if(existingBooking){
            return res.status(400).json({message:"Slot already booked for the selected date"})
        }

        const booking = new bookingModel({
            userId:req.user._id,
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
        res.status(error.status || 500).json( error.message || "Internal server error")
    }
}
const editBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { date, slot } = req.body;

        // Fetch the booking details by bookingId
        const booking = await bookingModel.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (booking.status !== "pending") {
            return res.status(400).json({ message: "Only pending bookings can be edited" });
        }

        // Fetch the turf details based on booking's turfId
        const turf = await turfModel.findById(booking.turfId);
        if (!turf) {
            return res.status(404).json({ message: "Turf not found for this booking" });
        }

        // Check if the requested slot exists in the turf's slots
        if (!turf.slots.includes(slot)) {
            return res.status(400).json({ message: "The requested slot is unavailable" });
        }

        // Check for booking conflict
        const conflict = await bookingModel.findOne({
            _id: { $ne: bookingId },
            turfId: booking.turfId,
            date,
            slot
        });

        if (conflict) {
            return res.status(400).json({ message: "Selected slot is already booked" });
        }

        // Modify the booking details
        booking.date = date || booking.date;
        booking.slot = slot || booking.slot;

        // Save the updated booking
        const updatedBooking = await booking.save();

        res.status(200).json({
            message: "Booking updated successfully",
            booking: updatedBooking,
            availableSlots: turf.slots // 🟨 send available slots to the frontend
        });

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json(error.message || "Internal server error");
    }
};

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
        catch(error){
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

//bookings by managers
const getBookingsByManager = async (req, res) => {
    try {
        const { managerId } = req.params;

        const bookings = await bookingModel.find()
            .populate('userId')
            .populate({
                path: 'turfId',
                match: { managerId: managerId }
            });

        const filteredBookings = bookings.filter(b => b.turfId !== null);

        res.status(200).json(filteredBookings);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(error.message || "Internal Server Error");
    }
};


//get single booking
const getBookingById = async (req, res) => {
    try {
        const { bookingId } = req.params;
        console.log("bookingId from params:", bookingId);

        const booking = await bookingModel.findById(bookingId)
            .populate('userId', 'name email')
            .populate('turfId');

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json(booking );
    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getBookingByIds = async (req, res) => {
    try {
        const { bookingId } = req.params;
        console.log("bookingId from params:", bookingId);

        const booking = await bookingModel.findById(bookingId)
            .populate('userId', 'name email')
            .populate('turfId');

        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }

        res.status(200).json({ booking }); // wrap in object for consistency
    } catch (error) {
        console.error("Error fetching booking by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


//get user-specific bookings
const getUserBookings = async (req,res)=>{
    try {
        const userId = req.user._id
        const bookings = await bookingModel.find({userId}).populate('turfId');

        res.status(200).json({bookings});

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).json( error.message || "Internal server error" );
    }
}

const getBookingsByTurf = async (req,res) => {
    try {
        const { turfId } = req.params;

        const bookings = await bookingModel.find({ turfId })
      .populate('userId')
      .populate('turfId');
      console.log("Turf ID received: ", turfId);
        const totalRevenue = bookings.reduce(( sum, b )=> sum + (b.price || 0), 0);

        res.status(200).json({ bookings, totalRevenue })
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json(error.message || "internal server error")
    }
}


const cancelBooking = async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await bookingModel.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        console.log("Booking User ID:", booking.userId.toString());
        console.log("Request User ID:", req.user._id);

        if (booking.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to cancel this booking" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.status(200).json({ message: "Booking cancelled successfully", booking });
    } catch (error) {
        console.error("Cancel Booking Error:", error);
        res.status(error.status || 500).json(error.message || "server error");
    }
};


const mongoose = require("mongoose");

const getBookingsByTurfAndDate = async (req, res) => {
    try {
        const { turfId, date } = req.params;

        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setDate(endOfDay.getDate() + 1);

        console.log("Turf ID:", turfId);
        console.log("Start:", startOfDay);
        console.log("End:", endOfDay);

        const bookings = await bookingModel.find({
            turfId: new mongoose.Types.ObjectId(turfId),
            date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        // Format each booking's date to 'YYYY-MM-DD'
        const formattedBookings = bookings.map(booking => {
            const formattedDate = booking.date.toISOString().split('T')[0];
            return {
                ...booking._doc,
                date: formattedDate
            };
        });

        console.log("Found bookings:", formattedBookings.length);
        res.status(200).json({ bookings: formattedBookings });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


module.exports = { createBooking, editBooking,manageBooking, getAllBooking, getBookingById, getUserBookings, getBookingsByTurf, cancelBooking, getBookingsByTurfAndDate, getBookingsByManager, getBookingByIds }
