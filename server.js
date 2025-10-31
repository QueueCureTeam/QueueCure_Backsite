require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { initDatabase } = require("./database/database");

// routes
const patientRoutes = require("./routes/patientRoutes");
const queueRoutes = require("./routes/queueRoutes");
const authRoutes = require("./routes/authRoutes");
const drugRoutes = require("./routes/drugRoutes");
const prescriptionRoutes = require("./routes/prescriptRoutes");
const staffRoutes = require("./routes/staffRoutes");

async function startServer() {
  await initDatabase();
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(
    cors({
      origin: [process.env.FRONTEND_URL, "http://queuecure.nettae.xyz", "https://queuecure.nettae.xyz", "https://homeothermal-crimsonly-benedict.ngrok-free.dev"],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      default: "https://queuecure.nettae.xyz/"
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  const { verifyToken } = require("./controllers/authController");
  app.get("/api/protected", verifyToken, (req, res) => {
    res.json({ message: "Hello " + req.user.email });
  });

  // routes
  app.use("/api/patient", patientRoutes);
  app.use("/api/queue", queueRoutes);
  app.use("/api/drug", drugRoutes);
  app.use("/api/prescription", prescriptionRoutes);
  app.use("/api/staff", staffRoutes);
  app.use("/auth", authRoutes);

  app.get("/", (req, res) => {
    res.status(200).send('OK');
  });

  app.get("/auth/callback", (req, res) => {
    let html = fs.readFileSync(path.join(__dirname, "public", "callback.html"), "utf8");
    html = html.replace("__FRONTEND_URL__", process.env.FRONTEND_URL);
    res.send(html);
  });

  app.get("/auth/login", (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = process.env.REDIRECT_URI;
    const cognitoDomain = process.env.COGNITO_DOMAIN;

    const loginUrl = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    res.redirect(loginUrl);
  });

  app.get("/auth/logout", (req, res) => {
    const clientId = process.env.CLIENT_ID;
    const redirectUri = process.env.FRONTEND_URL;
    const cognitoDomain = process.env.COGNITO_DOMAIN;

    const logoutUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      redirectUri
    )}`;
    res.redirect(logoutUrl);
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});