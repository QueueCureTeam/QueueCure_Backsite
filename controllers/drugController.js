const { getDbPool } = require("../database/database");

async function getAllDrug(req, res) {
    try {
        const db = getDbPool();
        const [drugs] = await db.query("SELECT * FROM Drug");
        res.status(200).json(drugs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getDrug(req, res) {
    try {
        const db = getDbPool();
        const { id } = req.params;
        const S3_BASE_URL = "https://image-storage-bucket-s3.s3.us-east-1.amazonaws.com/public/";
        
        const [rows] = await db.query("SELECT * FROM Drug WHERE DrugID = ?", [id]);
        const drug = rows[0];

        if (!drug) {
            return res.status(404).json({ message: "Drug not found" });
        }
        
        if (drug.ImageFileName) {
            drug.ImageURL = S3_BASE_URL + encodeURIComponent(drug.ImageFileName);
        } else {
            drug.ImageURL = null; 
        }
        res.status(200).json(drug);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

async function addDrug(req, res) { 
    try {
        const { Name, Details, Expiry_date, Price, StockQuantity } = req.body;
        const db = getDbPool();
        await db.execute("INSERT INTO Drug (Name, Details, Expiry_date, Price, StockQuantity) VALUES (?, ?, ?, ?, ?)", [Name, Details, Expiry_date, Price, StockQuantity]);
        res.status(201).json({ message: "Drug added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateDrug(req, res) { 
    try {
        const { id } = req.params;
        const { Name, Details, Expiry_date, Price, StockQuantity } = req.body;
        const db = getDbPool();
        await db.execute("UPDATE Drug SET Name = ?, Details = ?, Expiry_date = ?, Price = ?, StockQuantity = ? WHERE DrugID = ?", [Name, Details, Expiry_date, Price, StockQuantity, id]);
        res.status(200).json({ message: "Drug updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteDrug(req, res) { 
    try {
        const { id } = req.params;
        const db = getDbPool();
        await db.execute("DELETE FROM Drug WHERE DrugID = ?", [id]);
        res.status(200).json({ message: "Drug deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllDrug, getDrug, addDrug, updateDrug, deleteDrug };