const express = require("express")
const { verifyToken, checkRole } = require("../controllers/patientController");
const { getAllQueues, addQueue, deleteQueue, updateQueueStatus, getQueue, updateQueue } = require("../controllers/queueController");
const router = express.Router();

router.get("/", verifyToken, getAllQueues);
router.post("/addQueue", verifyToken, checkRole('Doctor'), addQueue);
router.delete("/deleteQueue/:id", verifyToken, checkRole('Doctor'), deleteQueue);
router.put("/updateStatus/:id", verifyToken, checkRole('Pharmacist'), updateQueueStatus);
router.get("/:id", verifyToken, getQueue);
router.put("/updateQueue/:id", verifyToken, checkRole('Doctor'), updateQueue);

module.exports = router;