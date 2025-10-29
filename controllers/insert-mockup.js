const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../database/QueueCure.db");

db.serialize(() => {
  const mockData = [
    [108, 'done', 'delivery', '2024-03-15 15:22:51', '-', 1, 'RX1761729176801'],
    [102, 'done', 'delivery', '2024-03-15 11:22:51', '-', 1, 'RX1761729176801'],
    [99, 'done', 'delivery', '2024-02-27 16:22:51', '-', 1, 'RX1761729176801']
  ];
  const stmt = db.prepare(`
    INSERT INTO queues (PatientID, Status, DeliveryOption, DateTime, PharmCounter, DoctorID, PrescriptionID)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
   mockData.forEach((row) => {
    stmt.run(row, (err) => {
      if (err) console.error("❌ Insert error:", err.message);
    });
  });

  stmt.finalize(() => console.log("✅ เพิ่ม mock data 20 แถวเรียบร้อยแล้ว"));
});

db.close();