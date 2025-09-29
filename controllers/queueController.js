require("dotenv").config();
const { initDatabase } = require("../database/database");

async function getQueue(req, res) {
    try {
        const db = await initDatabase();
        const queue = await db.all("SELECT * FROM Queue");
        res.status(200).json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function addQueue(req, res) {
  try {
    const { PatientID, Status, PharmCounter, PharmacistID, PrescriptionID } = req.body;

    if (!PatientID) {
      return res.status(400).json({ message: "Missing required fields: PatientID" });
    }

    const db = await initDatabase();

    const now = new Date().toISOString().replace("T", " ").split(".")[0];

    await db.run(
      `INSERT INTO Queue (PatientID, Status, DateTime, PharmCounter, PharmacistID, PrescriptionID) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [PatientID, Status || "waiting", now, PharmCounter || null, PharmacistID || null, PrescriptionID || null]
    );

    res.status(201).json({ message: "Patient added to queue successfully" });
  } catch (error) {
    console.error("Error adding queue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteQueue(req, res) {
    try {
        const { id } = req.params;
        const db = await initDatabase();
        await db.run("DELETE FROM Queue WHERE QueueID = ?", [id]);
        res.status(200).json({ message: "Queue deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

async function getQueueDetails(req, res) {
    try {
        const { id } = req.params;
        const db = await initDatabase();
        const queue = await db.get("SELECT * FROM Queue WHERE QueueID = ?", [id]);
        res.status(200).json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateQueueStatus(req, res) {
    try {
        const { id } = req.params;
        const { Status } = req.body;
        const db = await initDatabase();
        await db.run("UPDATE Queue SET Status = ? WHERE QueueID = ?", [Status, id]);
        res.status(200).json({ message: "Queue status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getQueue, addQueue, deleteQueue, updateQueueStatus, getQueueDetails };