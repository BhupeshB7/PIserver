const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const User = require('../../models/Admin/Admin');
const User = require('../../models/User');
const router = express.Router();
// const { hashPassword } = require('../../utils/passwordUtils');
// const adminAuth = require('../../controllers/Admin/adminAuth')
const JWT_SECRET = process.env.JWT_SECRET;
//For Admin login...
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });

//   if (!user) {
//     return res.status(400).json({ message: 'Invalid email or password' });
//   }

//   const isMatch = await bcrypt.compare(password, user.password);

//   if (!isMatch) {
//     return res.status(400).json({ message: 'Invalid email or password' });
//   }

//   if (user.role !== 'admin') {
//     return res.status(403).json({ message: 'You are not authorized to access this resource' });
//   }

//   const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

//   res.json({ token });
// });
// Middleware to check if the user is an admin or already authenticated
// Middleware to check if the user is an admin or already authenticated
const isAdminOrAuthenticatedMiddleware = async (req, res, next) => {
  const { email } = req.body;

  try {
    // Check if the request contains a valid admin token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const aToken = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(aToken, JWT_SECRET);

      // If the token is valid and the user is already authenticated, proceed with the login
      if (decodedToken) {
        return next();
      }
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }

    // If the user is an admin, store the user object in the request for further use
    req.adminUser = user;
    next();
  } catch (error) {
    console.error('Error while checking admin status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// For Admin login
router.post('/login', isAdminOrAuthenticatedMiddleware, async (req, res) => {
  const { password } = req.body;
  const user = req.adminUser;

  try {
    // Check if the request contains a valid admin token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const aToken = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(aToken, JWT_SECRET);

      // If the token is valid and the user is already authenticated, use it for authentication
      if (decodedToken) {
        const aToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '6h' });
        return res.json({ aToken });
      }
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '6h' });

    res.json({ token });
  } catch (error) {
    console.error('Error while logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// router.get('/api/users', async (req, res) => {
//   const users = await User.find();

//   res.json(users);
// });

// router.get('/api/users', async (req, res) => {
//   const searchQuery = req.query.search; // Get the search query parameter from the request

//   // Use a regular expression to perform a case-insensitive search for the given query
//   const searchRegex = new RegExp(searchQuery, 'i');

//   // Find all users whose name or email matches the search query
//   const users = await User.find({
//     $or: [
//       { name: searchRegex },
//       { sponsorId: searchRegex },
//       { userId: searchRegex }
//     ]
//   });

//   res.json(users);
// });

// server.js

// Define the number of items to display per page
const itemsPerPage = 20; // You can adjust this as needed

router.get('/api/users/account', async (req, res) => {
  const searchQuery = req.query.search; // Get the search query parameter from the request
  const page = parseInt(req.query.page) || 1; // Get the page number from the request, default to 1

  // Use a regular expression to perform a case-insensitive search for the given query
  const searchRegex = new RegExp(searchQuery, 'i');

  try {
    // Count the total number of matching users
    const totalUsersCount = await User.countDocuments({
      $or: [
        { name: searchRegex },
        { sponsorId: searchRegex },
        { userId: searchRegex },
      ],
    });

    // Calculate the number of pages
    const totalPages = Math.ceil(totalUsersCount / itemsPerPage);

    // Calculate the skip value to determine which documents to skip based on the page number
    const skip = (page - 1) * itemsPerPage;

    // Find users matching the search query with pagination
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { sponsorId: searchRegex },
        { userId: searchRegex },
      ],
    })
      .skip(skip)
      .select("name email mobile sponsorId userId is_active package isBlocked activationTime balance income selfIncome teamIncome topupWallet withdrawal")
      .limit(itemsPerPage);

    res.json({ users, totalPages });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user
router.put('/active/:id', async (req, res) => {
  try {
    const { is_active, activationTime } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { is_active, activationTime }, { new: true });

    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


  await User.findByIdAndDelete(id);

  res.json({ message: 'User deleted successfully' });
});
router.delete('/api/deposit/:id', async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }


  await User.findByIdAndDelete(id);

  res.json({ message: 'User deleted successfully' });
});

const isActive = (item) => item.is_active;

const countActiveItems = async (items) => {
  const activeItems = await items.filter(isActive);
  return activeItems.length;
};

router.get("/count-active-items", async (req, res) => {
  const items = await User.find();
  const numberOfActiveUser = await countActiveItems(items);
  res.json({ numberOfActiveUser });
});
const countInActiveItems = async (items) => {
  const inActiveItems = await items.filter(item=> !item.isActive);
  return inActiveItems.length;
};

router.get("/count-inactive-items", async (req, res) => {
  const items = await User.find();
  const numberOfInActiveUser = await countInActiveItems(items);
  res.json({ numberOfInActiveUser });
});
router.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/user/detail/:id',async(req,res)=>{
  try {
    const userDetails = await User.findOne({userId: req.params.id}).select("userId dailyIncome teamIncome selfIncome balance income");
    if(!userDetails){
      res.status(404).json({message: 'User not found'});
    }
res.json({message: 'Details fetched',userDetails});
  } catch (error) {
    res.status(501).json({error: error.message});
  }
})
router.post('/user/detailUpdate/:id', async (req, res) => {
  const { id } = req.params;
    const { selfIncome, dailyIncome, teamIncome, income, balance } = req.body;

    try {
        // Fetch the current user details
        const user = await User.findOne({ userId: id }).select('userId dailyIncome teamIncome selfIncome balance income');
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Update fields as required
        if (selfIncome !== undefined) user.selfIncome = (user.selfIncome || 0) + selfIncome;
        if (dailyIncome !== undefined) user.dailyIncome = dailyIncome;
        if (teamIncome !== undefined) user.teamIncome = (user.teamIncome || 0) + teamIncome;
        if (income !== undefined) user.income = (user.income || 0) + income;
        if (balance !== undefined) user.balance = (user.balance || 0) + balance;

        // Save the updated user details
        await user.save();

        res.status(200).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});



// Get all users (admin only)
// router.get('/users', adminAuth, async (req, res) => {
//     try {
//       const users = await User.find();
//       res.send(users);
//     } catch (error) {
//       res.status(500).send({ error: 'Internal server error.' });
//     }
//   });
  
module.exports = router;