require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { initDatabase } = require("../database/database");

const JWT_SECRET = process.env.JWT_SECRET;

async function registerPatient(req, res) {
    try {
        const { Username, Email, Password, PhoneNumber, Address, NationalID, ProfileImage, Name, Surname, Gender } = req.body;
        
        if (!Username || !Email || !Password || !PhoneNumber || !NationalID || !Name || !Surname || !Gender) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const db = await initDatabase();

        const existing = await db.get("SELECT * FROM Patient WHERE Username = ? OR Email = ?", [Username]);
        if (existing) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        await db.run(
            `INSERT INTO Patient (Username, Email, Password, PhoneNumber, Address, NationalID, ProfileImage, Name, Surname, Gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [Username, Email, hashedPassword, PhoneNumber, Address, NationalID, ProfileImage, Name, Surname, Gender]
        );

        res.status(201).json({ message: "Patient registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}


async function loginPatient(req, res) {
    try {
        const { Email, Password } = req.body;
        if (!Email || !Password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const db = await initDatabase();
        const user = await db.get("SELECT * FROM Patient WHERE Email = ?", [Email]);
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const isPasswordValid = await bcrypt.compare(Password, user.Password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign({ id: user.PatientID }, JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}
module.exports = { registerPatient, loginPatient };