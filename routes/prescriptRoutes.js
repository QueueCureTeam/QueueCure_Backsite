const express = require("express")
const { verifyToken } = require("../controllers/authController");
const { getAllPrescription, getPrescription, addPrescription, updatePrescription, deletePrescription } = require("../controllers/prescriptionController");
const router = express.Router();

router.get("/", verifyToken, getAllPrescription);
router.get("/:id", verifyToken, getPrescription);
router.post("/addPrescription", verifyToken, addPrescription);
router.put("/updatePrescription/:id", verifyToken, updatePrescription);
router.delete("/deletePrescription/:id", verifyToken, deletePrescription);

module.exports = router;