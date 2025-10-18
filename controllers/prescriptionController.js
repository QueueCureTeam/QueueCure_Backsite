// Hello this is Prescriptionดีลเล๊อเออ
require("dotenv").config();
const { initDatabase } = require("../database/database");

async function getAllPrescription(req, res) {
    try {
        const db = await initDatabase();
        const Prescriptions = await db.all("SELECT * FROM Prescription");
        res.status(200).json(Prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getPrescription(req, res) {
    try {
        const db = await initDatabase();
        const { id } = req.params;
        const Prescription = await db.get("SELECT * FROM Prescription WHERE PrescriptionID = ?", [id]);
        res.status(200).json(Prescription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

async function addPrescription(req, res) { 
    try {
        const { PrescriptionID, prescriptions } = req.body;
        const db = await initDatabase();
        if (!PrescriptionID || !Array.isArray(prescriptions) || prescriptions.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    for (const item of prescriptions) {
      const { DrugID, Quantity, Dosage } = item;

      if (!DrugID || !Quantity || !Dosage) {
        console.warn("ข้ามรายการที่ข้อมูลไม่ครบ:", item);
        continue;
      }

      await db.run(
        "INSERT INTO Prescription (PrescriptionID, DrugID, Quantity, Dosage) VALUES (?, ?, ?, ?)",
        [PrescriptionID, DrugID, Quantity, Dosage]
      );
    }
        res.status(201).json({ message: "Prescription added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updatePrescription(req, res) { 
    try {
        const { id } = req.params;
        const { DrugID, Quantity, Dosage } = req.body;
        const db = await initDatabase();
        await db.run("UPDATE Prescription SET DrugID = ?, Quantity = ?, Dosage = ? WHERE PrescriptionID = ?", [DrugID, Quantity, Dosage, id]);
        res.status(200).json({ message: "Prescription updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deletePrescription(req, res) { // อันนี้ไว้ใช้กับ postman only
    try {
        const { id } = req.params;
        const db = await initDatabase();
        await db.run("DELETE FROM Prescription WHERE PrescriptionID = ?", [id]);
        res.status(200).json({ message: "Prescription deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllPrescription, getPrescription, addPrescription, updatePrescription, deletePrescription };