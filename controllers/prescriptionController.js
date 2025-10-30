const { getDbPool } = require("../database/database");

async function getAllPrescription(req, res) {
    try {
        const db = getDbPool();
        const [Prescriptions] = await db.query("SELECT * FROM Prescription");
        res.status(200).json(Prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getPrescription(req, res) {
     try {
        const db = getDbPool();
        const { id } = req.params;
        
        const query = `
            SELECT 
                p.RowID, p.PrescriptionID, p.DrugID, p.Quantity, p.Dosage,
                d.Name as DrugName, d.Details as DrugDetails,
                d.Price as DrugPrice, d.Expiry_date
            FROM Prescription p
            LEFT JOIN Drug d ON p.DrugID = d.DrugID
            WHERE p.PrescriptionID = ?
        `;
        
        const [Prescriptions] = await db.query(query, [id]);
        
        res.status(200).json(Prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function addPrescription(req, res) { 
    const db = getDbPool();
    let connection; 

    try {
        connection = await db.getConnection(); 
        await connection.beginTransaction(); 

        const { PrescriptionID, prescriptions } = req.body;
        if (!PrescriptionID || !Array.isArray(prescriptions) || prescriptions.length === 0) {
            connection.release();
            return res.status(400).json({ message: "Invalid input data" });
        }

        for (const item of prescriptions) {
            const { DrugID, Quantity, Dosage } = item;
            if (!DrugID || !Quantity || !Dosage) {
                console.warn("ข้ามรายการที่ข้อมูลไม่ครบ:", item);
                continue;
            }

            const [drugRows] = await connection.query("SELECT StockQuantity FROM Drug WHERE DrugID = ?", [DrugID]);
            const drug = drugRows[0];
            
            if (!drug) {
                console.warn("ไม่พบยา DrugID:", DrugID);
                continue; 
            }
            
            if (drug.StockQuantity < Quantity) {
                console.warn("Stock ไม่พอสำหรับ DrugID:", DrugID);
                continue;
            }

            await connection.execute(
                "INSERT INTO Prescription (PrescriptionID, DrugID, Quantity, Dosage) VALUES (?, ?, ?, ?)",
                [PrescriptionID, DrugID, Quantity, Dosage]
            );

            await connection.execute(
                "UPDATE Drug SET StockQuantity = StockQuantity - ? WHERE DrugID = ?",
                [Quantity, DrugID]
            );
        }

        await connection.commit();
        res.status(201).json({ message: "Prescription added successfully" });

    } catch (error) {
        console.error(error);
        if (connection) await connection.rollback(); 
        res.status(500).json({ message: "Internal server error" });
    } finally {
        if (connection) connection.release(); 
    }
}

async function updatePrescription(req, res) { 
    try {
        const { id } = req.params;
        const { DrugID, Quantity, Dosage } = req.body;
        const db = getDbPool();
        await db.execute("UPDATE Prescription SET DrugID = ?, Quantity = ?, Dosage = ? WHERE PrescriptionID = ?", [DrugID, Quantity, Dosage, id]);
        res.status(200).json({ message: "Prescription updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deletePrescription(req, res) { 
    try {
        const { id } = req.params;
        const db = getDbPool();
        await db.execute("DELETE FROM Prescription WHERE PrescriptionID = ?", [id]);
        res.status(200).json({ message: "Prescription deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllPrescription, getPrescription, addPrescription, updatePrescription, deletePrescription };