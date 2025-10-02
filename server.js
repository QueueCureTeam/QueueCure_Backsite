require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

// routes
const patientRoutes = require("./routes/patientRoutes");
const queueRoutes = require("./routes/queueRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "Nettae118",
    resave: false,
    saveUninitialized: false,
}));

const checkAuth = (req, res, next) => {
    req.isAuthenticated = !!req.session.userInfo;
    next();
};

// routes
app.use("/api/patient", patientRoutes);
app.use("/api/queue", queueRoutes);
app.use("/auth", authRoutes);

app.get("/", checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "public", "signup.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
