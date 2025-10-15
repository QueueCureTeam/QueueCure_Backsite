const express = require("express")
const { verifyToken } = require("../controllers/authController");
const { editProfile, getProfile} = require("../controllers/patientController");
const router = express.Router();

router.put("/editProfile", verifyToken, editProfile);
router.get("/getProfile", verifyToken, getProfile);

module.exports = router;