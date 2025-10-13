const express = require("express")
const { getAllDrug, getDrug} = require("../controllers/drugController");
const router = express.Router();

router.put("/getAllDrug", getAllDrug);
router.get("/getDrug", getDrug);

module.exports = router;