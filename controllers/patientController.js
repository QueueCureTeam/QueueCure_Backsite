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

        jwt.verify(
            token, 
            pem, 
                { 
                algorithms: ["RS256"],
                issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}`,
                audience: process.env.CLIENT_ID 
                }, 
            (err, payload) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
            req.user = payload; 
            next();
        });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized" });
    }
};

function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden: No user information found." });
    }
    const userGroups = req.user['cognito:groups'];

    if (userGroups && userGroups.includes(requiredRole)) {
      next(); 
    } else {
      res.status(403).json({ message: "Forbidden: You do not have the required permissions." });
    }
  };
}


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
                "INSERT INTO Patient (CognitoSub, Name, Surname, NationalID) VALUES (?, ?, ?, ?)",
                [userId, "", "", ""]
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
        const { PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID } = req.body;

        const db = await initDatabase();

        const patient = await db.get("SELECT * FROM Patient WHERE CognitoSub = ?", [cognitoSub]);

        if (!patient) {
        await db.run(`
            INSERT INTO Patient (CognitoSub, PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [cognitoSub, PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID]);

        return res.status(201).json({ message: "Profile created successfully" });
        }

        await db.run(`
            UPDATE Patient
            SET PhoneNumber = ?, Address = ?, ProfileImage = ?, Name = ?, Surname = ?, Gender = ?, NationalID = ?
            WHERE CognitoSub = ?
        `, [PhoneNumber, Address, ProfileImage, Name, Surname, Gender, NationalID, cognitoSub]);

        res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }   
}

module.exports = { verifyToken, getProfile, editProfile, checkRole};