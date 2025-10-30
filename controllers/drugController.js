const { initDatabase } = require("../database/database");

async function getAllDrug(req, res) {
    try {
        const db = await initDatabase();
        const drugs = await db.all("SELECT * FROM Drug");
        res.status(200).json(drugs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function getDrug(req, res) {
    try {
        const db = await initDatabase();
        const { id } = req.params;
        const drug = await db.get("SELECT * FROM Drug WHERE DrugID = ?", [id]);
        res.status(200).json(drug);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

async function addDrug(req, res) { // อันนี้ไว้ใช้กับ postman only
    try {
        const { Name, Details, Expiry_date, Price, StockQuantity } = req.body;
        const db = await initDatabase();
        await db.run("INSERT INTO Drug (Name, Details, Expiry_date, Price, StockQuantity) VALUES (?, ?, ?, ?, ?)", [Name, Details, Expiry_date, Price, StockQuantity]);
        res.status(201).json({ message: "Drug added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateDrug(req, res) { // อันนี้ไว้ใช้กับ postman only
    try {
        const { id } = req.params;
        const { Name, Details, Expiry_date, Price, StockQuantity } = req.body;
        const db = await initDatabase();
        await db.run("UPDATE Drug SET Name = ?, Details = ?, Expiry_date = ?, Price = ?, StockQuantity = ? WHERE DrugID = ?", [Name, Details, Expiry_date, Price, StockQuantity, id]);
        res.status(200).json({ message: "Drug updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteDrug(req, res) { // อันนี้ไว้ใช้กับ postman only
    try {
        const { id } = req.params;
        const db = await initDatabase();
        await db.run("DELETE FROM Drug WHERE DrugID = ?", [id]);
        res.status(200).json({ message: "Drug deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllDrug, getDrug};