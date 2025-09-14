require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { initDatabase } = require("../database/database");

const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Forbidden" });
        }
        req.user = user;
        next();
    });
}

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

    async function editProfile(req, res) {
        try {
            const {id} = req.user;
            const {PhoneNumber, Address, ProfileImage, Name, Surname, Gender} = req.body;
            const db = await initDatabase();

            const patient = await db.get("SELECT * FROM Patient WHERE PatientID = ?", [id]);
            if (!patient) {
                return res.status(404).json({ message: "Patient not found" });
            }

            const updated = {
                PhoneNumber: PhoneNumber ?? patient.PhoneNumber,
                Address: Address ?? patient.Address,
                ProfileImage: ProfileImage ?? patient.ProfileImage,
                Name: Name ?? patient.Name,
                Surname: Surname ?? patient.Surname,
                Gender: Gender ?? patient.Gender,
            };

            await db.run(`
                UPDATE Patient
                SET PhoneNumber = ?, Address = ?, ProfileImage = ?, Name = ?, Surname = ?, Gender = ?
                WHERE PatientID = ?
            `, [updated.PhoneNumber, updated.Address, updated.ProfileImage, updated.Name, updated.Surname, updated.Gender, id]);
            res.status(200).json({ message: "Profile updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }   
    }

module.exports = { registerPatient, loginPatient, verifyToken, editProfile };