const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../database/QueueCure.db");

db.serialize(() => {
  const mockDrugs = [
  {
    Name: "Paracetamol (พาราเซตามอล)",
    Details: "ใช้สำหรับบรรเทาอาการปวด ลดไข้ เช่น ปวดศีรษะ ปวดฟัน ปวดกล้ามเนื้อ \n\nวิธีใช้: รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ",
    Expiry_date: "2027-10-31",
    Price: 50.00,
    StockQuantity: 1500,
  },
  {
    Name: "Amoxicillin (อะม็อกซีซิลลิน)",
    Details: "ยาปฏิชีวนะสำหรับรักษาการติดเชื้อแบคทีเรีย เช่น การติดเชื้อในระบบทางเดินหายใจ, หู, คอ, จมูก \n\nวิธีใช้: รับประทานครั้งละ 500 mg วันละ 3 ครั้ง หลังอาหาร (ต้องรับประทานให้หมดตามแพทย์สั่ง)",
    Expiry_date: "2026-06-30",
    Price: 120.50,
    StockQuantity: 350,
  },
  {
    Name: "Ibuprofen (ไอบูโพรเฟน)",
    Details: "ยาแก้ปวด ต้านการอักเสบ (NSAID) ใช้สำหรับบรรเทาอาการปวด บวม และลดไข้ \n\nวิธีใช้: รับประทานครั้งละ 400 mg หลังอาหารทันที ทุก 4-6 ชั่วโมง",
    Expiry_date: "2027-01-31",
    Price: 85.00,
    StockQuantity: 600,
  },
  {
    Name: "Loratadine (ลอราทาดีน)",
    Details: "ยาแก้แพ้ ใช้บรรเทาอาการแพ้ เช่น จาม, น้ำมูกไหล, คันตา, หรือลมพิษ \n\nวิธีใช้: รับประทานครั้งละ 10 mg วันละ 1 ครั้ง",
    Expiry_date: "2026-08-31",
    Price: 60.75,
    StockQuantity: 420,
  },
  {
    Name: "Omeprazole (โอเมพราโซล)",
    Details: "ยาลดกรดในกระเพาะอาหาร ใช้รักษาอาการกรดไหลย้อน, โรคแผลในกระเพาะอาหาร \n\nวิธีใช้: รับประทานครั้งละ 20 mg วันละ 1 ครั้ง ก่อนอาหารเช้า",
    Expiry_date: "2027-05-31",
    Price: 250.00,
    StockQuantity: 200,
  },
  {
    Name: "Simvastatin (ซิมวาสแตติน)",
    Details: "ยาลดไขมันในเส้นเลือด ใช้เพื่อลดระดับคอเลสเตอรอลและไตรกลีเซอไรด์ \n\nวิธีใช้: รับประทานครั้งละ 20 mg วันละ 1 ครั้ง ก่อนนอน",
    Expiry_date: "2026-11-30",
    Price: 300.00,
    StockQuantity: 180,
  },
  {
    Name: "Metformin (เมทฟอร์มิน)",
    Details: "ยารักษาโรคเบาหวานประเภทที่ 2 ช่วยควบคุมระดับน้ำตาลในเลือด \n\nวิธีใช้: รับประทานครั้งละ 500 mg วันละ 2 ครั้ง พร้อมอาหารเช้า-เย็น",
    Expiry_date: "2027-03-31",
    Price: 180.25,
    StockQuantity: 300,
  },
  {
    Name: "Amlodipine (แอมโลดิพีน)",
    Details: "ยาลดความดันโลหิตสูง และป้องกันอาการเจ็บหน้าอกจากโรคหลอดเลือดหัวใจ \n\nวิธีใช้: รับประทานครั้งละ 5 mg วันละ 1 ครั้ง",
    Expiry_date: "2026-09-30",
    Price: 150.00,
    StockQuantity: 250,
  },
  {
    Name: "Salbutamol Inhaler (ยาพ่นซัลบูตามอล)",
    Details: "ยาขยายหลอดลม ใช้สำหรับบรรเทาอาการหอบหืด หรือโรคปอดอุดกั้นเรื้อรัง (COPD) \n\nวิธีใช้: พ่น 1-2 ครั้ง เมื่อมีอาการหอบ",
    Expiry_date: "2027-04-30",
    Price: 450.00,
    StockQuantity: 80,
  },
  {
    Name: "Prednisolone (เพรดนิโซโลน)",
    Details: "ยาสเตียรอยด์ ใช้ต้านการอักเสบและกดภูมิคุ้มกัน ใช้รักษาโรคหลายชนิด เช่น ภูมิแพ้รุนแรง, ข้ออักเสบ \n\nวิธีใช้: รับประทานตามขนาดที่แพทย์สั่ง (เช่น 5-60 mg ต่อวัน)",
    Expiry_date: "2026-07-31",
    Price: 220.00,
    StockQuantity: 120,
  },
];
  const stmt = db.prepare(`
    INSERT INTO Drug (Name, Details, Expiry_date, Price, StockQuantity)
    VALUES (?, ?, ?, ?, ?)
  `);

  mockDrugs.forEach((drug) => {
    stmt.run(
      drug.Name,
      drug.Details,
      drug.Expiry_date,
      drug.Price,
      drug.StockQuantity,
      (err) => {
        if (err) console.error("❌ Insert error:", err.message);
      }
    );
  });


  stmt.finalize(() => console.log("✅ เพิ่ม mock data 20 แถวเรียบร้อยแล้ว"));
});

db.close();