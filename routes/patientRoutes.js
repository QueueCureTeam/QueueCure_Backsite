const express = require("express")
const { verifyToken, editProfile } = require("../controllers/patientController");
const router = express.Router();

router.put("/edit-profile", verifyToken, editProfile);

module.exports = router;