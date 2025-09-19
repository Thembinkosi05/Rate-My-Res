const db = require('../models');

// @desc    Create a new residence listing
// @route   POST /api/residences
// @access  Private/Admin
exports.createResidence = async (req, res) => {
  // The authMiddleware has already run, so we can access req.user.
  // This is a crucial security check to ensure only admins can create residences.
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Only administrators can perform this action.' });
  }

  const { name, address, description, university_id, image_urls } = req.body;

  // Basic input validation
  if (!name || !address || !university_id) {
    return res.status(400).json({ message: 'Name, address, and university ID are required.' });
  }

  try {
    // Find the university to ensure it exists
    const university = await db.University.findByPk(university_id);
    if (!university) {
      return res.status(404).json({ message: 'University not found.' });
    }

    // Create the new residence in the database
    const newResidence = await db.Residence.create({
      name,
      address,
      description,
      university_id,
      image_urls: image_urls || [], // Default to an empty array if not provided
    });

    res.status(201).json({
      message: 'Residence created successfully.',
      residence: newResidence
    });

  } catch (error) {
    console.error('Error creating residence:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ... (existing code for createResidence)

// @desc    Get all residence listings
// @route   GET /api/residences
// @access  Public
exports.getAllResidences = async (req, res) => {
  try {
    const residences = await db.Residence.findAll({
      include: [{
        model: db.University,
        as: 'university'
      }],
      // This will order them by the most recent ones first
      order: [['created_at', 'DESC']]
    });
    res.status(200).json(residences);
  } catch (error) {
    console.error('Error fetching residences:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Get a single residence listing by ID
// @route   GET /api/residences/:id
// @access  Public
exports.getResidenceById = async (req, res) => {
  try {
    const residence = await db.Residence.findByPk(req.params.id, {
      include: [{
        model: db.University,
        as: 'university'
      }]
    });

    if (!residence) {
      return res.status(404).json({ message: 'Residence not found.' });
    }
    res.status(200).json(residence);
  } catch (error) {
    console.error('Error fetching residence by ID:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// ... (existing code for get functions)

// @desc    Update an existing residence listing
// @route   PUT /api/residences/:id
// @access  Private/Admin
exports.updateResidence = async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  const { name, address, description, university_id, image_urls } = req.body;

  try {
    const residence = await db.Residence.findByPk(req.params.id);
    if (!residence) {
      return res.status(404).json({ message: 'Residence not found.' });
    }

    // If a new university_id is provided, check if that university exists
    if (university_id) {
      const university = await db.University.findByPk(university_id);
      if (!university) {
        return res.status(404).json({ message: 'University not found.' });
      }
    }

    await residence.update({
      name: name || residence.name,
      address: address || residence.address,
      description: description || residence.description,
      university_id: university_id || residence.university_id,
      image_urls: image_urls || residence.image_urls
    });

    res.status(200).json({ message: 'Residence updated successfully.', residence });

  } catch (error) {
    console.error('Error updating residence:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// @desc    Delete a residence listing
// @route   DELETE /api/residences/:id
// @access  Private/Admin
exports.deleteResidence = async (req, res) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied.' });
  }

  try {
    const residence = await db.Residence.findByPk(req.params.id);
    if (!residence) {
      return res.status(404).json({ message: 'Residence not found.' });
    }

    await residence.destroy();
    res.status(200).json({ message: 'Residence deleted successfully.' });

  } catch (error) {
    console.error('Error deleting residence:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};
// ... (possible More functions below)