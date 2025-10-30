const { getDbPool } = require("../database/database");

async function getProfile (req, res) {
    try {
        const userId = req.user.sub;
        const db = getDbPool();

        let patient;
        try {
            const [patientRows] = await db.query("SELECT * FROM Patient WHERE CognitoSub = ?", [userId]);
            patient = patientRows[0];
        } catch (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ message: "DB query failed" });
        }

        if (!patient) {
            await db.execute(
                "INSERT INTO Patient (CognitoSub, Name, Surname, NationalID, Age) VALUES (?, ?, ?, ?, ?)",
                [userId, "", "", "", NULL] 
            );
            
            const [newPatientRows] = await db.query("SELECT * FROM Patient WHERE CognitoSub = ?", [userId]);
            return res.status(200).json(newPatientRows[0]);
        }

        res.status(200).json(patient);  
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function editProfile(req, res) {
    try {
        const cognitoSub = req.user.sub;
        const { PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age } = req.body;

        const db = getDbPool();

        const [patientRows] = await db.query("SELECT * FROM Patient WHERE CognitoSub = ?", [cognitoSub]);
        const patient = patientRows[0];

        if (!patient) {
        await db.execute(`
            INSERT INTO Patient (CognitoSub, PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [cognitoSub, PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age]);

        return res.status(201).json({ message: "Profile created successfully" });
        }

        await db.execute(`
            UPDATE Patient
            SET PhoneNumber = ?, Address = ?, ProfileImage = ?, Name = ?, Surname = ?, Gender = ?, NationalID = ?, Age = ?
            WHERE CognitoSub = ?
        `, [PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age, cognitoSub]);

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }   
}


module.exports = { getProfile, editProfile };