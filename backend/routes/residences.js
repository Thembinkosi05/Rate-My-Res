const express = require('express');
const authMiddleware = require('../middleware/authMiddleware'); // Import the auth middleware
const residenceController = require('../controllers/residenceController');

const router = express.Router();

// Public routes (no authentication required)
// We pass authMiddleware first, so it runs before the controller logic.
router.get('/', residenceController.getAllResidences);
router.get('/:id', residenceController.getResidenceById);

// Private/Admin routes (authentication and admin check required)
// The `authMiddleware` check is done first for these routes.
router.post('/', authMiddleware, residenceController.createResidence);
router.put('/:id', authMiddleware, residenceController.updateResidence);
router.delete('/:id', authMiddleware, residenceController.deleteResidence);
// ... (More routes will be added below)

module.exports = router;