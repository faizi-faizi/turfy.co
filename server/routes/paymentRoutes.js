const { paymentFunction } = require('../controllers/paymentControllers')
const authMiddleware = require('../middlewares/authMiddleware')

const paymentRoutes = require('express').Router()

paymentRoutes.post("/stripe-checkout", authMiddleware, paymentFunction)


module.exports = paymentRoutes;
