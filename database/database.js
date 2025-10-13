const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

async function initDatabase() {
  const db = await open({
    filename: path.join(__dirname, "QueueCure.db"),
    driver: sqlite3.Database
  });

  await db.exec("PRAGMA foreign_keys = ON;");

  //Patient
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Patient (
      PatientID     INTEGER PRIMARY KEY AUTOINCREMENT,
      CognitoSub TEXT UNIQUE NOT NULL,
      PhoneNumber   TEXT,
      Address       TEXT,
      NationalID    TEXT,
      ProfileImage  TEXT,
      Name          TEXT,
      Surname       TEXT,
      Gender        TEXT 
    );
  `);

  //Staff
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Staff (
      StaffID   INTEGER PRIMARY KEY AUTOINCREMENT,
      Role      TEXT NOT NULL,
      Name      TEXT NOT NULL,
      Surname   TEXT NOT NULL,
      Gender    TEXT
    );
  `);

  //Drug
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Drug (
      DrugID        INTEGER PRIMARY KEY AUTOINCREMENT,
      Name          TEXT NOT NULL,
      Details       TEXT,
      Expiry_date   DATE,
      Price         REAL,
      StockQuantity INTEGER
    );
  `);

  //Prescription
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Prescription (
      RowID          INTEGER PRIMARY KEY AUTOINCREMENT,
      PrescriptionID INTEGER NOT NULL UNIQUE,
      DrugID         INTEGER NOT NULL,
      Quantity       INTEGER NOT NULL,
      Dosage         TEXT,
      FOREIGN KEY (DrugID) REFERENCES Drug(DrugID)
    );
  `);

  //Queue
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Queue (
      QueueID        INTEGER PRIMARY KEY AUTOINCREMENT,
      PatientID      INTEGER NOT NULL,
      Status         TEXT,
      DateTime       TEXT DEFAULT (datetime('now','localtime')),
      PharmCounter   TEXT,
      PharmacistID   INTEGER,
      PrescriptionID INTEGER,
      FOREIGN KEY (PatientID) REFERENCES Patient(PatientID),
      FOREIGN KEY (PharmacistID) REFERENCES Staff(StaffID),
      FOREIGN KEY (PrescriptionID) REFERENCES Prescription(PrescriptionID)
    );
  `);

  return db;
}

if (require.main === module) {
  (async () => {
    const db = await initDatabase();
    console.log("Database initialized!!");
    await db.close();
  })();
}

module.exports = { initDatabase };
