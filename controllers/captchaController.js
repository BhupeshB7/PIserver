const Captcha = require('../models/Captcha');

// Function to generate a random captcha
const generateCaptcha = () => {
  const characters = '0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return captcha;
};

exports.refreshCaptcha = async (req, res) => {
  try {
    const captcha = generateCaptcha();
    await Captcha.create({ captcha });
    res.json({ captcha });
  } catch (error) {
    // console.error('Error creating captcha:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.verifyCaptcha = async (req, res) => {
  try {
    const { userInput } = req.body;
    if (!userInput || userInput.length !== 6 || !/^[0-9]+$/.test(userInput)) {
      return res.status(400).json({ success: false, message: 'Invalid captcha format' });
    }
    const captcha = await Captcha.findOne({ captcha: userInput });
    if (captcha) {
        await Captcha.deleteOne({ captcha: userInput });
      res.json({ success: true, message: 'Captcha verified successfully!' });
    } else {
      res.json({ success: false, message: 'Captcha does not match' });
    }
  } catch (error) {
    // console.error('Error verifying captcha:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
