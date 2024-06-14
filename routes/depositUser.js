const express = require('express');
const fileUploader = require('express-fileuploader');
const path = require('path');
const Deposit = require('../models/Deposit');

const router = express.Router();

// Set up file uploader middleware
router.use(fileUploader({
  uploadDir: path.join(__dirname, 'client', 'uploads'), // Specify the uploads directory within the client folder
  allowedMimeTypes: ['image/jpeg','image/jpg', 'image/png']
}));

// Handle image upload
router.post('/', async (req, res) => {
//   try {
//     const file = req.files.file;

//     // Handle the image upload logic here

//     res.json({ message: 'Image uploaded successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to upload image' });
//   }
try {
    const file = req.files.file;

    // Create a new Image document
    const image = new Deposit({
      filename: file.name,
      originalName: file.originalname
    });

    // Save the image document to the database
    await image.save();

    res.json({ message: 'Image uploaded successfully' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

module.exports = router;
