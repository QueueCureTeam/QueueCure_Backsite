const express = require("express")
const { verifyToken, checkRole } = require("../controllers/authController");
const { getAllDrug, getDrug} = require("../controllers/drugController");
const router = express.Router();

router.get("/getAllDrug", verifyToken, checkRole('doctor'), getAllDrug);
router.get("/:id", verifyToken, checkRole('doctor'), getDrug);

module.exports = router;