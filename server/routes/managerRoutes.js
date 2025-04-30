const { loginManger, getManagerData, createManager } = require('../controllers/managerController');
const { login } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const managerRoutes = require('express').Router();

// Admin-only: create a manager
managerRoutes.post('/signup', authMiddleware, roleMiddleware(['admin']), createManager);

// Public: manager login
managerRoutes.post('/login', login);

// Protected: manager dashboard
managerRoutes.get('/dashboard', authMiddleware, roleMiddleware(['manager']), getManagerData);

module.exports = managerRoutes;