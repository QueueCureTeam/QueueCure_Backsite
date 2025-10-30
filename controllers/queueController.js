const { getDbPool } = require("../database/database");

async function getAllQueues(req, res) { // ทุกภาคส่วน
    try {
         const db = getDbPool();
        const [queue] = await db.query("SELECT * FROM Queues");
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

    const db = getDbPool();
    const [doctorRows] = await db.query("SELECT StaffID FROM Staff WHERE CognitoSub = ?", [CognitoSub]);
    const doctor = doctorRows[0];

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!PatientID) {
      return res.status(400).json({ message: "Missing required fields: PatientID" });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    await db.execute(
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
    const db = getDbPool();
    let connection;
    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction(); 

        const { id } = req.params;
        
        const [queueRows] = await connection.query("SELECT PrescriptionID FROM Queues WHERE QueueID = ?", [id]);
        const queue = queueRows[0];

        if (!queue) {
            connection.release(); 
            return res.status(404).json({ message: "Queue not found" });
        }
        
        const prescriptionID = queue.PrescriptionID;
        await connection.execute("DELETE FROM Prescription WHERE PrescriptionID = ?", [prescriptionID]);
        await connection.execute("DELETE FROM Queues WHERE QueueID = ?", [id]);

        await connection.commit();
        res.status(200).json({ message: "Queue and Prescriptions deleted successfully!" });

    } catch (error) {
        console.error(error);
        if (connection) await connection.rollback(); 
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (connection) connection.release();
    }
}

async function getQueue(req, res) {
  try {
    const { id } = req.params;
    const db = getDbPool();

    const query = `
      SELECT 
        q.QueueID, q.PatientID, q.Status, q.DateTime, q.PharmCounter, 
        q.DoctorID, q.PrescriptionID,
        p.Name AS PatientName, p.Surname AS PatientSurname, p.Gender AS PatientGender, 
        p.Age AS PatientAge, p.PhoneNumber AS PatientPhone, p.Address AS PatientAddress, 
        p.NationalID AS PatientNationalID, p.CognitoSub AS PatientCognitoSub,
        s.Name AS DoctorName, s.Surname AS DoctorSurname
      FROM Queues q
      LEFT JOIN Patient p ON q.PatientID = p.PatientID
      LEFT JOIN Staff s ON q.DoctorID = s.StaffID
      WHERE q.QueueID = ?
    `;

    const [queueRows] = await db.query(query, [id]);
    const queue = queueRows[0];
    const user = req.user; 
    const userGroups = user['cognito:groups'] || [];

    if (userGroups.includes("doctor") || userGroups.includes("pharmacist")) {
    } 
    else if (queue.PatientCognitoSub !== user.sub) {
      return res.status(403).json({ message: "คุณไม่มีสิทธิ์เข้าถึงคิวนี้" });
    }
    res.status(200).json(queue);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getPatientQueue(req, res) { 
    try {
        const { id } = req.params; 
        const db = getDbPool();

        const [patientRows] = await db.query(
        "SELECT PatientID FROM Patient WHERE CognitoSub = ?",
        [id]
        );
        const patient = patientRows[0];

    if (!patient) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคนไข้" });
    }

    const [queueRows] = await db.query(
      "SELECT * FROM Queues WHERE PatientID = ?",
      [patient.PatientID]
    );
    const queue = queueRows[0];

    if (!queue) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคิว" });
    }

    res.status(200).json(queue);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateQueueStatus(req, res) { 
    try {
        const { id } = req.params;
        const { Status, PharmCounter } = req.body;
        const db = getDbPool();
        await db.execute("UPDATE Queues SET Status = ?, PharmCounter = ? WHERE QueueID = ?", [Status, PharmCounter, id]);
        res.status(200).json({ message: "Queue status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateQueueToDelivery(req, res) { 
    try {
        const { id } = req.params;
        const { DeliveryOption, Status } = req.body;
        const db = getDbPool();
        await db.execute("UPDATE Queues SET DeliveryOption = ?, Status = ? WHERE QueueID = ?", [DeliveryOption, Status, id]);
        res.status(200).json({ message: "Queue status updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllPatient(req, res) {
  try {
    const db = getDbPool();
    const [patients] = await db.query(`
      SELECT * FROM Patient
      WHERE Name IS NOT NULL
        AND Surname IS NOT NULL
        AND Gender IS NOT NULL
        AND NationalID IS NOT NULL
    `);
    res.status(200).json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getPatient(req, res) {
   try {
        const { id } = req.params;
        const db = getDbPool();
        const [patientRows] = await db.query("SELECT * FROM Patient WHERE PatientID = ?", [id]);
        const patient = patientRows[0];
        res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getQueue, addQueue, deleteQueue, updateQueueStatus, getAllQueues, getAllPatient, getPatient, getPatientQueue, updateQueueToDelivery };