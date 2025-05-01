const { register, login, profile, updateUser, deleteUser, changePassword } = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

const userRoutes = require('express').Router()

userRoutes.post('/register', register)
userRoutes.post('/login', login)
userRoutes.get('/profile',authMiddleware,profile)
userRoutes.patch("/update",authMiddleware,updateUser)
userRoutes.delete("/delete-user/:userId", authMiddleware, deleteUser)
userRoutes.put("/change-password",authMiddleware,changePassword)

module.exports = userRoutes

module.exports = userRoutes