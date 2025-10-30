require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { getSecret } = require("./aws_config/awsSecret");

// routes
const patientRoutes = require("./routes/patientRoutes");
const queueRoutes = require("./routes/queueRoutes");
const authRoutes = require("./routes/authRoutes");
const drugRoutes = require("./routes/drugRoutes");
const prescriptionRoutes = require("./routes/prescriptRoutes");
const staffRoutes = require("./routes/staffRoutes");

async function startServer() {
  const secretName = "web-Secret"; // ชื่อตามใน Secrets Manager
  const secrets = await getSecret(secretName);

  const app = express();
  const PORT = secrets.PORT || 3000;

  app.use(
    cors({
      origin: secrets.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
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
    res.sendFile(path.join(__dirname, "public", "signup.html"));
  });

  app.get("/auth/callback", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "callback.html"));
  });

  app.get("/auth/login", (req, res) => {
    const clientId = secrets.CLIENT_ID;
    const redirectUri = secrets.REDIRECT_URI;
    const cognitoDomain = secrets.COGNITO_DOMAIN;

    const loginUrl = `https://${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(
      redirectUri
    )}`;
    res.redirect(loginUrl);
  });

  app.get("/auth/logout", (req, res) => {
    const clientId = secrets.CLIENT_ID;
    const redirectUri = secrets.FRONTEND_URL;
    const cognitoDomain = secrets.COGNITO_DOMAIN;

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