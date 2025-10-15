require("dotenv").config();
const { initDatabase } = require("../database/database");
 
async function createStaff (req, res) { /* ยิง postman */
    try {
        console.log("Body received:", req.body);
        const { CognitoSub, Role, Name, Surname, LicenseID, Gender} = req.body;
        const db = await initDatabase();
        await db.run(
            "INSERT INTO Staff (CognitoSub, Role, Name, Surname, LicenseID, Gender) VALUES (?, ?, ?, ?, ?, ?)",
            [CognitoSub, Role, Name, Surname, LicenseID, Gender]);
        res.status(201).json({ message: "Staff created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
async function getProfile (req, res) {
    try {
        const userId = req.user.sub;
        const db = await initDatabase();

        let Staff;
        try {
            Staff = await db.get("SELECT * FROM Staff WHERE CognitoSub = ?", [userId]);
        } catch (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ message: "DB query failed" });
        }

        if (!Staff) {
            await db.run(
                "INSERT INTO Staff (CognitoSub, Name, Surname, LicenseID, Gender) VALUES (?, ?, ?, ?, ?)",
                [userId, "", "", "", ""]
            );
        const newStaff = await db.get("SELECT * FROM Staff WHERE StaffID = ?", [userId]);
        return res.status(200).json(newStaff);
        }

        res.status(200).json(Staff);  
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function editProfile(req, res) {
    try {
        console.log("Body received:", req.body);
        const { CognitoSub, Role, Name, Surname, LicenseID, Gender} = req.body;

        const db = await initDatabase();

        const Staff = await db.get("SELECT * FROM Staff WHERE CognitoSub = ?", [CognitoSub]);

        if (!Staff) {
        await db.run(`
            INSERT INTO Staff (CognitoSub, Role, Name, Surname, LicenseID, Gender)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [CognitoSub, Role, Name, Surname, LicenseID, Gender]);

        return res.status(201).json({ message: "Profile created successfully" });
        }

        await db.run(`
            UPDATE Staff
            SET Role = ?, Name = ?, Surname = ?, LicenseID = ?, Gender = ?
            WHERE CognitoSub = ?
        `, [Role, Name, Surname, LicenseID, Gender, CognitoSub]);

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }   
}


module.exports = { createStaff, getProfile, editProfile };