const { adminLogin, adminProfile } = require('../controllers/adminControllers')
const authMiddleware = require('../middlewares/authMiddleware')
const roleMiddleware = require('../middlewares/roleMiddleware')

const adminRoutes = require('express').Router()

adminRoutes.post('/admin-login', adminLogin)
adminRoutes.get('/profile', authMiddleware, roleMiddleware(['admin']), adminProfile)

module.exports = adminRoutes