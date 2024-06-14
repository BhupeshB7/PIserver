// controllers/profileController.js
const Image = require('../models/Image');

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    if (req.file.size > 100000) {
      return res.status(400).send('File size should not exceed 100KB.');
    }

    const profile = new Image({
      image: req.file.buffer,
    });

    await profile.save();
    res.status(201).send('Profile created successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error.');
  }
};





