// awsSecrets.js
const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");

const client = new SecretsManagerClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN,
  },
});

async function getSecret(secretName) {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const data = await client.send(command);

    if ("SecretString" in data) {
      return JSON.parse(data.SecretString);
    } else {
      return JSON.parse(Buffer.from(data.SecretBinary, "base64").toString("ascii"));
    }
  } catch (err) {
    console.error("Error retrieving secret:", err);
    throw err;
  }
}

module.exports = { getSecret };
