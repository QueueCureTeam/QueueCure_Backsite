const { initDatabase } = require("../database/database");

async function getProfile (req, res) {
    try {
        const userId = req.user.sub;
        const db = await initDatabase();

        let patient;
        try {
            patient = await db.get("SELECT * FROM Patient WHERE CognitoSub = ?", [userId]);
        } catch (err) {
            console.error("SQL Error:", err.message);
            return res.status(500).json({ message: "DB query failed" });
        }

        if (!patient) {
            await db.run(
                "INSERT INTO Patient (CognitoSub, Name, Surname, NationalID, Age) VALUES (?, ?, ?, ?, ?)",
                [userId, "", "", "", ""]
            );
        const newPatient = await db.get("SELECT * FROM Patient WHERE PatientID = ?", [userId]);
        return res.status(200).json(newPatient);
        }

        res.status(200).json(patient);  
        } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

async function editProfile(req, res) {
    try {
        const cognitoSub = req.user.sub; // มาจาก JWT
        const { PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age } = req.body;

        const db = await initDatabase();

        const patient = await db.get("SELECT * FROM Patient WHERE CognitoSub = ?", [cognitoSub]);

        if (!patient) {
        await db.run(`
            INSERT INTO Patient (CognitoSub, PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [cognitoSub, PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, Age]);

        return res.status(201).json({ message: "Profile created successfully" });
        }

        await db.run(`
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