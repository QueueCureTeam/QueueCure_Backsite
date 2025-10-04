require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");

const { initDatabase } = require("../database/database");

let pems;

async function fetchPems() {
  if (pems) return pems;

  const region = process.env.AWS_REGION;
  const userPoolId = process.env.USER_POOL_ID;
  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

  const { data } = await axios.get(url);
  pems = {};
  data.keys.forEach(key => {
    pems[key.kid] = jwkToPem(key);
  });
  return pems;
}

async function verifyToken (req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const pems = await fetchPems();
        const decoded = jwt.decode(token, { complete: true });
        if (!decoded || !decoded.header) {
            return res.status(401).json({ message: "Invalid token", error: token });
        }
        const kid = decoded.header.kid;
        const pem = pems[kid];
        if (!pem) throw new Error("Invalid token");

        jwt.verify(token, pem, { algorithms: ["RS256"] }, (err, payload) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.user = payload; 
        next();
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized" });
    }
};

/*async function registerPatient(req, res) {
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
    
}*/

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

module.exports = { verifyToken, editProfile };