const express = require('express');
const nodemailer = require('nodemailer');
const ContactInfo = require('../models/ContactInfo');
const router = express.Router();

router.post('/send-email', async (req, res) => {
  try {
    const {name, email, message} = req.body;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user:process.env.EMAIL,
        pass:process.env.PASSWORD
      },
    });

    const mailOptions = {
      from: email,
      to:process.env.EMAIL,
      subject: 'New contact form submission',
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.sendStatus(200);
  } catch (error) {
    // console.error(error);
    res.sendStatus(500);
  }
});
// Insert new user route
// API endpoints
router.get('/contactInfo', async (req, res) => {
  try {
    const user = await ContactInfo.findOne(); // Assuming only one user for simplicity
    res.json(user || {});
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/contactInfo', async (req, res) => {
  try {
    const existingUser = await ContactInfo.findOne();

    if (existingUser) {
      // User already exists, update the details
      const updatedUser = await ContactInfo.findByIdAndUpdate(existingUser._id, req.body, { new: true });
      res.json(updatedUser);
    } else {
      // User does not exist, create a new one
      const newUser = new  ContactInfo (req.body);
      await newUser.save();
      res.json(newUser);
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid data provided' })
    // console.error(error);
  }
});

module.exports = router;