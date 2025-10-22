const express = require("express")
const { verifyToken, checkRole } = require("../controllers/authController");
const { getAllQueues, getAllPatient, getPatient, addQueue, deleteQueue, updateQueueStatus, getQueue, getPatientQueue } = require("../controllers/queueController");
const router = express.Router();

router.get("/", getAllQueues); // everyone
router.get("/patients", verifyToken, checkRole('doctor'), getAllPatient); // doctor
router.get("/patients/:id", verifyToken, checkRole('doctor'), getPatient); // doctor
router.post("/addQueue", verifyToken, checkRole('doctor'), addQueue); // doctor
router.delete("/:id", verifyToken, checkRole('doctor'), deleteQueue); // doctor
router.put("/:id", verifyToken, checkRole('doctor', 'pharmacist'), updateQueueStatus); // pharm, doctor
router.get("/:id", verifyToken, getQueue); // doctor + pharm
router.get("/self/:id", verifyToken, getPatientQueue); // everyone

module.exports = router;