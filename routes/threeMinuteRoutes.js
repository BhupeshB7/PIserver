const express = require("express");
const sessionController3 = require("../controllers/sessionController3");

const router = express.Router();

router.get("/createSession", sessionController3.createSession3);
router.get("/api/user/getTimer/:sessionId", sessionController3.getTimer3);
router.get("/getLatestSession", sessionController3.getLatestSession3);
router.post("/oneMinuteHistory", sessionController3.insertOneMinuteHistory3);
router.post("/MinuteuserResult", sessionController3.processGame);
router.get("/MinuteResultHistory", sessionController3.getGameHistory);
// router.post("/oneMinuteResultofUser", sessionController.getOneMinuteResult);

// {
//   "sessionId":"PI2410230",
//   "userId":"PI21820725",
//   "betAmount":20,
//   "userChoiceLetter":"Small"
// }
module.exports = router;
