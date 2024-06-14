const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/profileUpdate', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (req.body.name) {
      user.name = req.body.name.trim();
    }

    if (req.body.bio) {
      user.bio = req.body.bio.trim();
    }
    if (req.body.address) {
      user.address = req.body.address.trim();
    }
    if (req.body.accountNo) {
      user.accountNo = req.body.accountNo.trim();
    }
   
    if (req.body.ifscCode) {
      user.ifscCode = req.body.ifscCode.trim();
    }
    if (req.body.mobile) {
      const mobile = req.body.mobile.trim();
      const mobileExists = await User.findOne({ mobile });
      if (mobileExists && mobileExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Mobile number already exists' });
      }
      user.mobile = mobile;
    }
    //
    // if (req.body.aadhar) {
    //   const aadhar = req.body.aadhar.trim();
    //   const aadharExists = await User.findOne({ aadhar });
    //   if (aadharExists && aadharExists._id.toString() !== user._id.toString()) {
    //     return res.status(400).json({ error: 'Aadhar number already exists' });
    //   }
    //   user.aadhar = aadhar;
    // }
    //For google Pay
    if (req.body.GPay) {
      const GPay = req.body.GPay.trim();
      const GPayExists = await User.findOne({ GPay });
      if (GPayExists && GPayExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Gpay number already exists' });
      }
      user.GPay = GPay;
    }

    if (req.body.email) {
      const email = req.body.email.trim().toLowerCase();
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      user.email = email;
    }
    if (req.body.aadhar) {
      user.aadhar = req.body.aadhar;
    }
    user.updateCount += 1;

    // Mark details as updated
    user.detailsUpdated = true;
    await user.save();
      
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    // console.error(error.message);
    res.status(500).send('Server Error for updation');
  }
});


module.exports = router;
