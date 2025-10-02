const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/signup", authController.showSignupPage);
router.get("/confirm", authController.showConfirmPage);
router.get("/login", authController.showLoginPage);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/confirm", authController.confirm);

module.exports = router;
