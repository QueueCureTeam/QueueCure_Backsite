const { getDbPool } = require("../database/database");

async function createStaff (req, res) { /* ยิง postman */
    try {
        console.log("Body received:", req.body);
        const { CognitoSub, Role, Name, Surname, LicenseID, Gender} = req.body;
        
        const db = getDbPool();

        await db.execute(
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
        const db = getDbPool();

        let Staff;
        try {
            const [staffRows] = await db.query("SELECT * FROM Staff WHERE CognitoSub = ?", [userId]);
            Staff = staffRows[0];

        } catch (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ message: "DB query failed" });
        }


        if (!Staff) {
            return res.status(404).json({ message: "Staff profile not found." });
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

        const db = getDbPool();

        const [staffRows] = await db.query("SELECT * FROM Staff WHERE CognitoSub = ?", [CognitoSub]);
        const Staff = staffRows[0];

        if (!Staff) {
        await db.execute(`
            INSERT INTO Staff (CognitoSub, Role, Name, Surname, LicenseID, Gender)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [CognitoSub, Role, Name, Surname, LicenseID, Gender]);

        return res.status(201).json({ message: "Profile created successfully" });
        }

        await db.execute(`
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