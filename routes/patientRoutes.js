const express = require("express")
const { verifyToken, checkRole } = require("../controllers/authController");
const { editProfile, getProfile} = require("../controllers/patientController");
const router = express.Router();

router.put("/editProfile", verifyToken, checkRole(), editProfile);
router.get("/getProfile", verifyToken, checkRole(), getProfile);

module.exports = router;