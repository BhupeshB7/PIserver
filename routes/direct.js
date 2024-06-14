
const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/direct/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 5, sortField = 'name', sortOrder = 'asc'  } = req.query;

    const user = await User.findOne({ userId }).lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalSponsors = await User.countDocuments({ sponsorId: userId });
    const totalPages = Math.ceil(totalSponsors / limit);

    const sponsors = await User.find({ sponsorId: userId })
      .sort({ [sortField]: sortOrder })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    if (!sponsors || sponsors.length === 0) {
      return res.status(404).json({ error: 'Sponsors not found' });
    }

    res.status(200).json({
      currentPage: parseInt(page),
      lastPage: totalPages,
      totalPage: totalPages,
      totalData: totalSponsors,
      data: sponsors
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
