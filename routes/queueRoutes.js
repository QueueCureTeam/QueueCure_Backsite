const express = require("express")
const { verifyToken } = require("../controllers/patientController");
const { getQueue, addQueue, deleteQueue, updateQueueStatus, getQueueDetails } = require("../controllers/queueController");
const router = express.Router();

router.get("/", verifyToken, getQueue);
router.post("/add-queue", verifyToken, addQueue);
router.delete("/delete-queue/:id", verifyToken, deleteQueue);
router.put("/update-queue/:id", verifyToken, updateQueueStatus);
router.get("/:id", verifyToken, getQueueDetails);

module.exports = router;