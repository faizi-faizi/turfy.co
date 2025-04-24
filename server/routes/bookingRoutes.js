const { 
    createBooking, manageBooking, editBooking, getAllBooking, getBookingById, getUserBookings 
} = require('../controllers/bookingController')

const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

const bookingRoutes = require('express').Router()

// Users
bookingRoutes.post("/create-booking", authMiddleware, createBooking)
bookingRoutes.patch('/edit-booking', authMiddleware, editBooking)
bookingRoutes.get('/booking/:bookingId', authMiddleware, getBookingById)
bookingRoutes.get('/user/all', authMiddleware, getUserBookings)

// Manager
bookingRoutes.patch('/bookings/:bookingId', authMiddleware, roleMiddleware(['manager']), manageBooking)

// Admin or Manager
bookingRoutes.get('/all-bookings', authMiddleware, roleMiddleware(['manager', 'admin']), getAllBooking)

module.exports = bookingRoutes