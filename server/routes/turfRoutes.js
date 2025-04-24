const { 
    listTurf, turfDetails, createTurf, updateTurf, deleteTurf 
} = require('../controllers/turfControllers')

const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')
const upload = require('../middlewares/multer')

const turfRoutes = require('express').Router()

// Public routes
turfRoutes.get('/list-turfs', listTurf)
turfRoutes.get('/list-turfs/:turfId', turfDetails)

// Manager/Admin protected routes
turfRoutes.post('/create-turf', authMiddleware, roleMiddleware(['manager']), upload.array("images", 3), createTurf)
turfRoutes.patch('/update-turf/:turfId', authMiddleware, roleMiddleware(['manager']), upload.array("images", 3), updateTurf)
turfRoutes.delete('/delete-turf/:turfId', authMiddleware, roleMiddleware(['manager', 'admin']), deleteTurf)

module.exports = turfRoutes