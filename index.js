const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");
const schedule = require('node-schedule');
const http = require("http");
const dotenv = require("dotenv");
const cloudinaryConfig = require("./cloudinaryConfig");
const User = require("./models/User");
const fs = require('fs'); // Import the file system module
const taskRoutes = require("./routes/taskRoute");
// const sessionRoutes = require("./routes/sessionRoutes");
// const sessionRoutes3 = require("./routes/threeMinuteRoutes");
const GameProfile = require("./models/GameProfile");
const captchaRoutes = require('./routes/captchaRoutes');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error(error));

const app = express();
const server = http.createServer(app);


// Middleware
// app.use(cors());
app.use(
  cors({
    // origin:"https://powerfullindia.com",
    origin:"https://www.powerfullindia.com",
    origin: "*",
    // origin:"http://localhost:3000",
  })
);
cloudinaryConfig();
app.use(express.json());

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Routes
app.use("/api", taskRoutes);
app.use("/api/auth", require("./routes/auth"));
app.use("/api/task", require("./routes/task"));
app.use("/api/users", require("./routes/users"));
app.use("/api/users", require("./routes/register"));
app.use("/api/users", require("./routes/ReTopupUser"));
app.use("/api/auth", require("./routes/passwordReset"));
app.use("/api/active", require("./routes/UserAuthTask"));
app.use("/api/users", require("./routes/profile"));
app.use("/api/admin", require("./routes/Admin/admin"));
app.use("/api/deposit", require("./routes/deposit"));
app.use("/api/withdraw", require("./routes/withdraw"));
app.use("/api", require("./routes/direct"));
app.use("/api", require("./routes/level"));
app.use("/api", require("./routes/fundMove"));
app.use("/api", require("./routes/contact"));
app.use("/api", require("./routes/fundMove"));
app.use("/userTasks", require("./routes/userTaskRoute"));
// app.use("/api/gameProfile", require("./routes/GameRoutes"));
app.use("/api/game", require("./routes/game"));
// app.use("/api", require("./routes/LiveGameUser"));
app.use("/api", require("./routes/GameDeposit"));
app.use("/api", require("./routes/image"));
app.use("/api", require("./routes/WalletTransfer"));
app.use("/api", require("./routes/changePassword"));
app.use("/api/notice", require("./routes/notice"));
app.use("/api/gift", require("./routes/GiftCode"));
app.use('/captcha', captchaRoutes);
// app.use("/", sessionRoutes);
// app.use("/three", sessionRoutes3);
app.use("/server",(req,res)=>{
  res.json({message:"Server Started!"});
})
// Schedule daily income reset using cron


// Function to update users according to the specified logic
async function updateUserLogic() {
  try {
    // Find users where teamIncomeValidation is greater than or equal to 200
    const usersToUpdate = await User.find({ teamIncomeValidation: { $gte: 200 } });

    // Update selfIncome and teamIncomeValidation for each user
    const promises = usersToUpdate.map(async (user) => {
      if(user.package===500){
        user.dailyIncome-=20;
        user.selfIncome -= 20;
        user.balance -= 20;
        user.income -= 20;   
        user.teamIncomeValidation = 0;
      }
     else if(user.package===1000){
        user.dailyIncome-=50;
        user.selfIncome -= 50;
        user.balance -= 50;
        user.income -= 50;   
        user.teamIncomeValidation = 0;
      }
      await user.save();
    });

    // Wait for all updates to complete
    await Promise.all(promises);

    console.log('Users TeamIncomeValidation updated successfully');
  } catch (err) {
    console.error('Error updating users:', err);
  }
}
// {teamIncomeValidation:{$gte:150}}
// Schedule the function to run at 11:23 PM every day
cron.schedule('07 06 * * *', async () => {
  // Call the updateUserLogic function
  await updateUserLogic();
}, {
  timezone: "Asia/Kolkata" // Specify your timezone here
});

// Fetch all users data using async/await
// (async () => {
//   try {
//     const users = await GameProfile.find({});
    
//     // Convert users data to JSON format
//     const jsonData = JSON.stringify(users, null, 2);
    
//     // Write the JSON data to a new file
//     fs.writeFile('gameProfile.json', jsonData, (err) => {
//       if (err) {
//         console.error('Error writing file:', err);
//         return;
//       }
//       console.log('Users data has been saved to users.json');
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//   }
// })();

// 3minutes Games Schema End
//
// Image upload routes
const imageSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});
const Image = mongoose.model("CarouselImage", imageSchema);
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const image = new Image({
      name: originalname,
      data: buffer,
      contentType: mimetype,
    });
    await image.save();
    res.status(201).send("Image uploaded successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/images", async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await Image.findByIdAndDelete(id);
    res.status(200).send("Image deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
// Pagination endpoint
app.get("/api/randomData", async (req, res) => {
  const perPage = 15;
  const page = req.query.page || 1;

  try {
    const data = await RandomData.find({})
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalDocuments = await RandomData.countDocuments();
    const totalPages = Math.ceil(totalDocuments / perPage);

    res.json({
      data,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 
// async function getUserTeam(userId, depth) {
//   try {
//     if (depth <= 0) {
//       // If depth reaches 0, return null to stop recursion
//       return null;
//     }

//     const user = await User.findOne({ userId }).select('userId completed name mobile sponsorId').lean();

//     if (!user) {
//       return null;
//     }

//     const activeStatus = user.completed ? 'completed' : 'unCompleted';
//     const teamStructure = {
//       level: 6 - depth,
//       userId: user.userId,
//       status: activeStatus,
//       name: user.name,
//       sponsorId: user.sponsorId,
//       mobile: user.mobile,
//       downlineCount: 0,
//       allUsersCount: 0,
//       downline: [],
//     };

//     const downlineUsers = await User.find({ sponsorId: userId }).lean();
//     const downlinePromises = downlineUsers.map((downlineUser) => getUserTeam(downlineUser.userId, depth - 1)); // Decrement depth in recursive call
//     const downlineTeam = await Promise.all(downlinePromises);

//     // Remove null elements from downlineTeam array
//     const filteredDownlineTeam = downlineTeam.filter((item) => item !== null);

//     teamStructure.downline = filteredDownlineTeam;
//     teamStructure.downlineCount = filteredDownlineTeam.length;

//     // Count number of all users and active users
//     teamStructure.allUsersCount = filteredDownlineTeam.reduce((count, downline) => count + downline.allUsersCount + 1, 0);

//     // console.info(teamStructure);

//     return teamStructure;
//   } catch (error) {
//     throw error;
//   }
// }

// async function displayTeamByLevel(userId, depth) {
//   try {
//     const team = await getUserTeam(userId, depth);

//     if (!team) {
//       return;
//     }

//     // Display level 0 users first
//     console.log(`Level ${team.level}:`);
//     displayUsers(team);

//     // Recursively display downline users by level
//     team.downline.forEach((downlineUser) => displayTeamByLevel(downlineUser.userId, depth - 1));
//   } catch (error) {
//     console.error('Error fetching user team:', error);
//   }
// }

// function displayUsers(user) {
//   console.log(`Name: ${user.name}, Mobile: ${user.mobile}, Sponsor ID: ${user.sponsorId}, User ID: ${user.userId}, Level: ${user.level}, Status: ${user.status}`);
// }
// now,everything correct i want add onemore thing i.e. i have also another schema(userTask) in this userId status 
// i also want return return time add taskStatus report complete or not based on userTaskStatus and userId(User from user schema)
// Example usage:
// displayTeamByLevel('PI21820725', 6);
app.put('/users/withdrawalDone', async (req, res) => {
  try {
    // Update only users where is_active is true
    const result = await User.updateMany({ is_active: true }, { $set: { withdrawalDone: true } });
    res.json({ message: 'Active users deactivated successfully', modifiedCount: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
