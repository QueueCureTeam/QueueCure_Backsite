const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/signup", authController.signup);
router.get("/signup", authController.showSignupPage);
router.get("/confirm", authController.showConfirmPage);
router.post("/confirm", authController.confirm);

module.exports = router;
