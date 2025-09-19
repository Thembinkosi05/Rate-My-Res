const db = require('../models');

// @desc    Submit a new review for a residence
// @route   POST /api/residences/:residenceId/reviews
// @access  Private
exports.submitReview = async (req, res) => {
  // The authMiddleware has run, so we can access req.user
  const { id: userId } = req.user;
  const { residenceId } = req.params;
  const { overall_rating, cleanliness_rating, safety_rating, facilities_rating, management_rating, social_atmosphere_rating, value_rating, comment } = req.body;

  try {
    // Simple validation
    if (!overall_rating || overall_rating < 1 || overall_rating > 5) {
      return res.status(400).json({ message: 'Overall rating is required and must be between 1 and 5.' });
    }

    // Find the residence to ensure it exists
    const residence = await db.Residence.findByPk(residenceId);
    if (!residence) {
      return res.status(404).json({ message: 'Residence not found.' });
    }

    // Opt Check if the user has already reviewed this residence
    const existingReview = await db.Review.findOne({
        where: { user_id: userId, residence_id: residenceId }
    });
    if (existingReview) {
        return res.status(409).json({ message: 'You have already submitted a review for this residence.' });
    }

    // Create the new review
    const newReview = await db.Review.create({
      user_id: userId,
      residence_id: residenceId,
      overall_rating,
      cleanliness_rating,
      safety_rating,
      facilities_rating,
      management_rating,
      social_atmosphere_rating,
      value_rating,
      comment,
      is_approved: false // Set to false for admin moderation
    });

    // --- Recalculate Average Rating (CRITICAL STEP) ---
    // 1. Get all reviews for the residence
    const reviews = await db.Review.findAll({
        where: { residence_id: residenceId },
        attributes: ['overall_rating'] // Only fetch the overall_rating column
    });

    // 2. Calculate the new average
    const totalRating = reviews.reduce((sum, review) => sum + review.overall_rating, 0);
    const avgOverallRating = reviews.length > 0 ? (totalRating / reviews.length) : 0;

    // 3. Update the Residence model with the new average and review count
    await residence.update({
        avg_overall_rating: avgOverallRating,
        total_reviews: reviews.length
    });

    res.status(201).json({
        message: 'Review submitted successfully and pending approval.',
        review: newReview,
        updatedResidence: {
            id: residence.id,
            avg_overall_rating: avgOverallRating,
            total_reviews: reviews.length
        }
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get all reviews for a specific residence
// @route   GET /api/residences/:residenceId/reviews
// @access  Public
exports.getReviewsForResidence = async (req, res) => {
  const { residenceId } = req.params;

  try {
    // Find the residence to ensure it exists
    const residence = await db.Residence.findByPk(residenceId);
    if (!residence) {
      return res.status(404).json({ message: 'Residence not found.' });
    }

    // Find all reviews for the residence
    const reviews = await db.Review.findAll({
      where: {
        residence_id: residenceId
      },
      // We include the User and its email for displaying who wrote the review
      include: [{
        model: db.User,
        as: 'user', // Match the alias in your model association
        attributes: ['email'] // Only fetch the email to protect user privacy
      }],
      order: [['created_at', 'DESC']] // Order by most recent review
    });

    res.status(200).json({
      residence,
      reviews
    });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};


// ... (More functions will be added below)