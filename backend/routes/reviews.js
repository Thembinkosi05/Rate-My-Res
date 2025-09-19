const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');
const router = express.Router();

// GET /api/residences/:residenceId/reviews (Public Route)
router.get('/:residenceId/reviews', reviewController.getReviewsForResidence);

// POST /api/residences/:residenceId/reviews (Protected Route)
router.post('/:residenceId/reviews', authMiddleware, reviewController.submitReview);

module.exports = router;