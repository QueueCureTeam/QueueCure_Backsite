const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../database/QueueCure.db");

db.serialize(() => {

  db.run(
    "INSERT INTO Prescription (RowID, PrescriptionID, DrugID, Quantity, Dosage) VALUES (?, ?, ?, ?, ?)",
    [2, 1002, 1, 21, "กินครั้งละ 1 เม็ด วันละ 3 เวลา หลังอาหาร"]
  );
});
db.close();
