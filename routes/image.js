const express = require('express');
const multer = require('multer');
const Image = require('../models/Image');
const router = express.Router();

// Define a storage strategy for multer (adjust the destination as needed)
const storage = multer.memoryStorage();
const upload = multer({
     storage: storage,
     limits: { fileSize: 100000 }, // Maximum file size in bytes (100KB)
 });

// Upload image
// router.post('/image/upload/:userId', upload.single('image'), async (req, res) => {
//     const userId = req.params;
//     const { originalname, buffer } = req.file;
  
//     try {
//       const pdf = new Image({
//         filename: originalname,
//         data: buffer, // Store the file data as a Buffer in MongoDB
//       });
//       await pdf.save();
//       res.json({ message: 'Image uploaded successfully' });
//     } catch (error) {
//       console.error('Error uploading PDF:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
router.post('/image/upload/:userId', upload.single('image'), async (req, res) => {
    const userId = req.params.userId; // Extract userId from route parameter
    const { originalname, buffer } = req.file;
  
    try {
        if (req.file.size > 400000) {
            return res.status(400).json({ error: 'File size exceeds the maximum limit (100KB)' });
          }
          // Check if mobile number already exists
   
      const image = new Image({
        userId: userId, // Associate the image with the user
        filename: originalname,
        data: buffer, // Store the file data as a Buffer in MongoDB
      });
  
      await image.save();
      res.json({ message: 'Image uploaded successfully' });
    } catch (error) {
    //   console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
// Fetch image
router.get('/image/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const image = await Image.findOne({ userId: userId});

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.setHeader('Content-Type', 'image/jpeg'); // Example: Set content type as JPEG, adjust as needed
    res.send(image.data);
  } catch (error) {
    // console.error(error);
    res.status(500).json({ error: 'Error fetching image' });
  }
});

module.exports = router;
