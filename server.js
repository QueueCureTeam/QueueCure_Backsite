require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use("/api/patient", patientRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});