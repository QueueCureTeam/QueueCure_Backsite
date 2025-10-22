
require("dotenv").config();

const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");


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


function checkRole(...requiredRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(403).json({ message: "Forbidden: No user information found." });
    }

    const userGroups = req.user['cognito:groups'];

    if (userGroups && requiredRoles.some(role => userGroups.includes(role))) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: You do not have the required permissions." });
    }
  };
}
module.exports = { verifyToken, checkRole };