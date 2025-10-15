const express = require("express")
const { verifyToken, checkRole} = require("../controllers/authController");
const {  editProfile, getProfile, createStaff } = require("../controllers/staffController");
const router = express.Router();

router.post("/createStaff", createStaff);
router.put("/editProfile", editProfile);
router.get("/getProfile", getProfile);

module.exports = router;