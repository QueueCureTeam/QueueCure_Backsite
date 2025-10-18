require("dotenv").config();
const { initDatabase } = require("../database/database");

async function getAllQueues(req, res) { // ทุกภาคส่วน
    try {
        const db = await initDatabase();
        const queue = await db.all("SELECT * FROM Queues");
        res.status(200).json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function addQueue(req, res) { // หมอ
  try {
    const { PatientID, Status, PharmCounter, PrescriptionID } = req.body;
    const CognitoSub = req.user.sub;

    const db = await initDatabase();
    const doctor = await db.get("SELECT StaffID FROM Staff WHERE CognitoSub = ?", [CognitoSub]);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!PatientID) {
      return res.status(400).json({ message: "Missing required fields: PatientID" });
    }
    const now = new Date().toISOString().replace("T", " ").split(".")[0];

    await db.run(
      `INSERT INTO Queues (PatientID, Status, DateTime, PharmCounter, DoctorID, PrescriptionID)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [PatientID, Status || "waiting", now, PharmCounter || "-", doctor.StaffID, PrescriptionID || null]
    );

    res.status(201).json({ message: "Patient added to queue successfully" });
  } catch (error) {
    console.error("Error adding queue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteQueue(req, res) { // หมอ
    try {
        const { id } = req.params;
        const db = await initDatabase();
        const queue = await db.get("SELECT PrescriptionID FROM Queues WHERE QueueID = ?", [id]);
         if (!queue) {
            return res.status(404).json({ message: "Queue not found" });
        }
        
        const prescriptionID = queue.PrescriptionID;
        await db.run("DELETE FROM Prescription WHERE PrescriptionID = ?", [prescriptionID]);
        await db.run("DELETE FROM Queues WHERE QueueID = ?", [id]);
        res.status(200).json({ message: "Queue and Prescriptions deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

async function getQueue(req, res) { // หมอ + เภสัช
    try {
        const { id } = req.params;
        const db = await initDatabase();
        const queue = await db.get("SELECT * FROM Queues WHERE QueueID = ?", [id]);
        res.status(200).json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateQueue(req, res) { // หมอ 
    try {
        const { id } = req.params;
        const { PharmCounter, DoctorID, PrescriptionID } = req.body
        const db = await initDatabase();
        const queue = await db.get("UPDATE Queues SET PharmCounter = ?, DoctorID = ?, PrescriptionID = ? WHERE QueueID = ?", [PharmCounter, DoctorID, PrescriptionID, id]);
        res.status(200).json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateQueueStatus(req, res) { // เภสัช
    try {
        const { id } = req.params;
        const { Status } = req.body;
        const db = await initDatabase();
        await db.run("UPDATE Queues SET Status = ? WHERE QueueID = ?", [Status, id]);
        res.status(200).json({ message: "Queue status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllPatient(req, res) {
   try {
        const { id } = req.params;
        const db = await initDatabase();
        const patient = await db.get("SELECT * FROM Patient", [id]);
        res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getPatient(req, res) {
   try {
        const { id } = req.params;
        const db = await initDatabase();
        const patient = await db.get("SELECT * FROM Patient WHERE PatientID = ?", [id]);
        res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getQueue, addQueue, deleteQueue, updateQueueStatus, getAllQueues, updateQueue, getAllPatient, getPatient };