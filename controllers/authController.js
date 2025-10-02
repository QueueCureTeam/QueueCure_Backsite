const path = require("path");
const cognitoService = require("../services/cognitoService");

exports.signup = async (req, res) => {
    const { username, password, email, givenName, familyName, birthdate, gender, nationalId, phoneNumber } = req.body;
    try {
        const user = await cognitoService.signUp(username, password, {
            email, givenName, familyName, birthdate, gender, nationalId, phoneNumber
        });
        res.json({ message: "Signup successful", user });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};

exports.showSignupPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "signup.html"));
};

exports.showConfirmPage = (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "confirm.html"));
};

exports.confirm = async (req, res) => {
    const { username, code } = req.body;
    try {
        const result = await cognitoService.confirmUser(username, code);
        res.json({ message: "User confirmed successfully!", result });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};
