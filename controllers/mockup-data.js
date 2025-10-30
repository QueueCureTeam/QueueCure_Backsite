const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../database/QueueCure.db");

db.serialize(() => {
   db.run("Delete FROM Drug WHERE DrugID = 10", (err) => {
    if (err) {
      console.error("❌ ลบตารางไม่สำเร็จ:", err.message);
    } else {
      console.log("✅ ลบตาราง Drug ออกจากฐานข้อมูลเรียบร้อยแล้ว");
    }
  });
});
