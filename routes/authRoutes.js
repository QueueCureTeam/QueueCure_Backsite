const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("querystring");

// Google_token
router.post("/callback", async (req, res) => {
    const code = req.body.code || req.query.code;
    if (!code) return res.status(400).json({ error: "No code provided" });

    const tokenUrl = `https://${process.env.COGNITO_DOMAIN}/oauth2/token`;

    const params = {
        grant_type: "authorization_code",
        client_id: process.env.CLIENT_ID,
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
    };

    try {
        const response = await axios.post(tokenUrl, qs.stringify(params), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        const { access_token, id_token, refresh_token } = response.data;
        res.json({ access_token, id_token, refresh_token });

    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(400).json({ error: "Failed to exchange code for token" });
    }
});

module.exports = router;
