const bookingModel = require('../model/bookingModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../model/userModel')

const createManager = async (req, res) => {
    try {
        //Ensure only admin can create a manager
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied, only admins can add managers" });
        }

        const { name, email, phone, password } = req.body;

        //Validate input fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        //Check if manager already exists
        const existingManager = await userModel.findOne({ email });
        if (existingManager) {
            return res.status(400).json({ message: "Manager with this email already exists" });
        }

        //Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create a new manager
        const newManager = new userModel({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "manager",  // Set role to "manager"
        });

        // Save to database
        const savedManager = await newManager.save();

        return res.status(201).json({
            message: "Manager created successfully",
            manager: {
                id: savedManager._id,
                name: savedManager.name,
                email: savedManager.email,
                phone: savedManager.phone,
                role: savedManager.role,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const turfModel = require('../model/turfModel');

const getManagerData = async (req, res) => {
    try {
        // Ensure the user object is available
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User data missing" });
        }

        const managerId = req.user._id;
        console.log("✅ Manager ID:", managerId);

        // Fetch turfs added by this manager
        const turfs = await turfModel.find({ managerId });
        if (!turfs.length) {
            console.log("⚠️ No turfs found for this manager.");
        } else {
            console.log(`✅ Found ${turfs.length} turfs`);
        }

        // Extract turf IDs to fetch bookings
        const turfIds = turfs.map(turf => turf._id);
        console.log("Manager's Turf IDs:", turfIds.map(id => id.toString()));

        // Get bookings related to the manager's turfs

        const bookings = await bookingModel
            .find({ turfId: { $in: turfIds } })
            .populate('userId', 'name email')  // You can choose what fields you want to populate
            .populate('turfId', 'name location')
            .populate('managerId', 'name email')
            .populate('paymentId', 'amount status');

        console.log(`✅ Found ${bookings.length} bookings`);

        // Calculate total revenue from bookings
        const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.price || 0), 0);

        // Filter bookings from last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const newBookings = bookings.filter(booking => new Date(booking.createdAt) >= sevenDaysAgo);

        // Final response
        return res.status(200).json({
            managerId,
            turfs,
            bookings,
            totalRevenue,
            newBookingCount: newBookings.length,
            newBookings
        });

    } catch (error) {
        console.error("❌ Error in getManagerData:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};








module.exports = { createManager, getManagerData }