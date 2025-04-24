const { addReview, getTurfReviews, updateReview, deleteReview } = require('../controllers/reviewController');

const reviewRoutes = require('express').Router();

reviewRoutes.post('/post-review',addReview)
reviewRoutes.get('/turf-reviews/:turfId', getTurfReviews)
reviewRoutes.put('/update-review/:reviewId',updateReview)
reviewRoutes.delete('/delete-review/:reviewId', deleteReview)

module.exports = reviewRoutes