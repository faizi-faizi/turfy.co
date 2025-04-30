const { 
    createBooking, manageBooking, editBooking, getAllBooking, getBookingById, getUserBookings, 
    getBookingsByTurf,
    cancelBooking,
    getBookingsByTurfAndDate,
    getBookingsByManager,
    getBookingByIds
} = require('../controllers/bookingController')

const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

const bookingRoutes = require('express').Router()

// Users
bookingRoutes.post("/create-booking", authMiddleware, createBooking)
bookingRoutes.patch('/edit-booking/:bookingId', authMiddleware, editBooking)
bookingRoutes.get('/booking/:bookingId', authMiddleware, getBookingById)
bookingRoutes.get('/bookings/:bookingId', authMiddleware, getBookingByIds)
bookingRoutes.get('/user/all', authMiddleware, getUserBookings)
bookingRoutes.patch('/cancel/:id', authMiddleware, cancelBooking)
bookingRoutes.get('/booking-by-turf-date/:turfId/:date', authMiddleware, getBookingsByTurfAndDate)



// Admin or Manager
bookingRoutes.get('/all-bookings', authMiddleware, roleMiddleware(['manager', 'admin']), getAllBooking)
bookingRoutes.get('/turf/:turfId', authMiddleware, roleMiddleware(['manager']), getBookingsByTurf);
bookingRoutes.get('/:managerId', authMiddleware, roleMiddleware(['manager']), getBookingsByManager);
bookingRoutes.patch('/:bookingId/status', authMiddleware, manageBooking);



module.exports = bookingRoutes