const express = require("express")
const { registerPatient, loginPatient, verifyToken, editProfile } = require("../controllers/patientController");
const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.put("/edit-profile", verifyToken, editProfile);

module.exports = router;