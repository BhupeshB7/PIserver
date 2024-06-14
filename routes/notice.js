const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const Button = require('../models/Button');

// Create a notice
router.post('/v1', async (req, res) => {
  try {
    const newNotice = new Notice(req.body);
    const savedNotice = await newNotice.save();
    res.json(savedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notices
router.get('/v1', async (req, res) => {
  try {
    const notices = await Notice.find().sort('-timestamp');
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a notice by ID
router.delete('/notice/:id', async (req, res) => {
  try {
    const deletedNotice = await Notice.findByIdAndRemove(req.params.id);
    if (!deletedNotice) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    res.json(deletedNotice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/button', async (req, res) => {
  try {
    const button = await Button.findOne();
    if (!button) {
      // If no document is found, create a new one with default values
      const newButton = new Button({ active: false });
      await newButton.save();
      return res.json(newButton);
    }
    res.json(button);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/button/toggle', async (req, res) => {
  try {
    let button = await Button.findOne();
    if (!button) {
      // If no document is found, create a new one with default values
      button = new Button({ active: false });
      await button.save();
    }
    button.active = !button.active;
    await button.save();
    res.json(button);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
module.exports = router;
