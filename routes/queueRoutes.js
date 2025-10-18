const express = require("express")
const { verifyToken, checkRole } = require("../controllers/authController");
const { getAllQueues, getAllPatient, getPatient, addQueue, deleteQueue, updateQueueStatus, getQueue, updateQueue } = require("../controllers/queueController");
const router = express.Router();

router.get("/", getAllQueues);
router.get("/patients", verifyToken, checkRole('doctor'), getAllPatient);
router.get("/patients/:id", verifyToken, checkRole('doctor'), getPatient);
router.post("/addQueue", verifyToken, checkRole('doctor'), addQueue);
router.delete("/deleteQueue/:id", verifyToken, checkRole('doctor'), deleteQueue);
router.put("/updateStatus/:id", verifyToken, checkRole('Pharmacist'), updateQueueStatus);
router.get("/:id", verifyToken, checkRole('doctor'), getQueue);
router.put("/updateQueue/:id", verifyToken, checkRole('doctor'), updateQueue);

module.exports = router;