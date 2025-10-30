-- MySQL dump 10.16  Distrib 10.1.48-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: db
-- ------------------------------------------------------
-- Server version 10.1.48-MariaDB-0+deb9u2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Drug`
--
-- (ผมแก้โครงสร้างนี้ใหม่ทั้งหมด ให้ตรงกับ SQLite ต้นฉบับ)
--

DROP TABLE IF EXISTS `Drug`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Drug` (
  `DrugID` INT PRIMARY KEY AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Details` TEXT,
  `Expiry_date` DATE NULL, -- แก้จาก VARCHAR เป็น DATE และอนุญาต NULL
  `Price` DECIMAL(10, 2) DEFAULT NULL, -- แก้จาก (5,2) เป็น (10,2) เพื่อรองรับราคาสูง
  `StockQuantity` INT DEFAULT NULL,
  `ImageFileName` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Drug`
--

LOCK TABLES `Drug` WRITE;
/*!40000 ALTER TABLE `Drug` DISABLE KEYS */;
-- (ผมแก้ '' ที่ Expiry_date เป็น NULL ให้ครับ)
INSERT INTO `Drug` VALUES (1,'Paracetamol (พาราเซตามอล)','ใช้สำหรับบรรเทาอาการปวด ลดไข้ เช่น ปวดศีรษะ ปวดฟัน ปวดกล้ามเนื้อ \n\nวิธีใช้: รับประทานครั้งละ 1-2 เม็ด ทุก 4-6 ชั่วโมง เมื่อมีอาการ',NULL,50.00,1500,'Paracetamol.png'),(2,'Amoxicillin (อะม็อกซีซิลลิน)','ยาปฏิชีวนะสำหรับรักษาการติดเชื้อแบคทีเรีย เช่น การติดเชื้อในระบบทางเดินหายใจ, หู, คอ, จมูก \n\nวิธีใช้: รับประทานครั้งละ 500 mg วันละ 3 ครั้ง หลังอาหาร (ต้องรับประทานให้หมดตามแพทย์สั่ง)',NULL,120.50,329,'Amoxicillin.jpg'),(3,'Ibuprofen (ไอบูโพรเฟน)','ยาแก้ปวด ต้านการอักเสบ (NSAID) ใช้สำหรับบรรเทาอาการปวด บวม และลดไข้ \n\nวิธีใช้: รับประทานครั้งละ 400 mg หลังอาหารทันที ทุก 4-6 ชั่วโมง',NULL,85.00,588,'Ibuprofen.png'),(4,'Loratadine (ลอราทาดีน)','ยาแก้แพ้ ใช้บรรเทาอาการแพ้ เช่น จาม, น้ำมูกไหล, คันตา, หรือลมพิษ \n\nวิธีใช้: รับประทานครั้งละ 10 mg วันละ 1 ครั้ง',NULL,60.75,420,'Loratadine.webp'),(5,'Omeprazole (โอเมพราโซล)','ยาลดกรดในกระเพาะอาหาร ใช้รักษาอาการกรดไหลย้อน, โรคแผลในกระเพาะอาหาร \n\nวิธีใช้: รับประทานครั้งละ 20 mg วันละ 1 ครั้ง ก่อนอาหารเช้า',NULL,250.00,200,'Omeprazole.webp'),(6,'Simvastatin (ซิมวาสแตติน)','ยาลดไขมันในเส้นเลือด ใช้เพื่อลดระดับคอเลสเตอรอลและไตรกลีเซอไรด์ \n\nวิธีใช้: รับประทานครั้งละ 20 mg วันละ 1 ครั้ง ก่อนนอน',NULL,300.00,180,'Simvastatin.webp'),(7,'Metformin (เมทฟอร์มิน)','ยารักษาโรคเบาหวานประเภทที่ 2 ช่วยควบคุมระดับน้ำตาลในเลือด \n\nวิธีใช้: รับประทานครั้งละ 500 mg วันละ 2 ครั้ง พร้อมอาหารเช้า-เย็น',NULL,180.25,300,'Metformin.webp'),(8,'Amlodipine (แอมโลดิพีน)','ยาลดความดันโลหิตสูง และป้องกันอาการเจ็บหน้าอกจากโรคหลอดเลือดหัวใจ \n\nวิธีใช้: รับประทานครั้งละ 5 mg วันละ 1 ครั้ง',NULL,150.00,250,'Amlodipine.jpeg'),(9,'Salbutamol Inhaler (ยาพ่นซัลบูตามอล)','ยาขยายหลอดลม ใช้สำหรับบรรเทาอาการหอบหืด หรือโรคปอดอุดกั้นเรื้อรัง (COPD) \n\nวิธีใช้: พ่น 1-2 ครั้ง เมื่อมีอาการหอบ',NULL,450.00,78,'SalbutamolInhaler.webp'),(11,'Prednisolone (เพรดนิโซโลน)','ยาสเตียรอยด์ ใช้ต้านการอักเสบและกดภูมิคุ้มกัน ใช้รักษาโรคหลายชนิด เช่น ภูมิแพ้รุนแรง, ข้ออักเสบ \n\nวิธีใช้: รับประทานตามขนาดที่แพทย์สั่ง (เช่น 5-60 mg ต่อวัน)',NULL,220.00,120,'Prednisolone.jpg');
/*!40000 ALTER TABLE `Drug` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Patient`
--

DROP TABLE IF EXISTS `Patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Patient` (
  `PatientID` INT PRIMARY KEY AUTO_INCREMENT,
  `CognitoSub` VARCHAR(255) UNIQUE NOT NULL,
  `PhoneNumber` VARCHAR(30) DEFAULT NULL,
  `Address` TEXT DEFAULT NULL,
  `NationalID` VARCHAR(30) DEFAULT NULL,
  `ProfileImage` TEXT DEFAULT NULL,
  `Name` VARCHAR(255) DEFAULT NULL,
  `Surname` VARCHAR(255) DEFAULT NULL,
  `Gender` VARCHAR(10) DEFAULT NULL,
  `Age` INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Patient`
--

LOCK TABLES `Patient` WRITE;
/*!40000 ALTER TABLE `Patient` DISABLE KEYS */;
INSERT INTO `Patient` VALUES (1,'84586498-2021-7072-0e17-33158fd21a41',989649134,'142 soi 106 Ramkhamhaeng Ramkhamhaeng Rd Saphansung',111888333456,NULL,'Piyapol','Intaladchum','ชาย',18),(4,'54d8d498-6041-70b0-e49f-d40a689e6515',989649134,'142 soi 106 Ramkhamhaeng Ramkhamhaeng Rd Saphansung',1181181181888,NULL,'กิตติวุฒ','วุฒิคุนาปะโกน','หญิง',25);
/*!40000 ALTER TABLE `Patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Prescription`
--

DROP TABLE IF EXISTS `Prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Prescription` (
  `RowID` INT PRIMARY KEY AUTO_INCREMENT,
  `PrescriptionID` VARCHAR(100) NOT NULL,
  `DrugID` INT NOT NULL,
  `Quantity` INT NOT NULL,
  `Dosage` TEXT DEFAULT NULL
  -- FOREIGN KEY จะถูกเพิ่มตอนท้าย
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Prescription`
--

LOCK TABLES `Prescription` WRITE;
/*!40000 ALTER TABLE `Prescription` DISABLE KEYS */;
INSERT INTO `Prescription` VALUES (4,'RX1761827324381',2,21,'ทานต่อเนื่องจนหมด วันละ 3 ครั้ง'),(5,'RX1761827324381',3,12,'ทานหลังอาหารทุก 4-6 ชั่วโมง หยุดทานเมื่อไม่มีอาการ'),(6,'RX1761827417418',9,2,'ใช้พ่น เมื่อมีอาการหอบ ');
/*!40000 ALTER TABLE `Prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Queues`
--

DROP TABLE IF EXISTS `Queues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Queues` (
  `QueueID` INT PRIMARY KEY AUTO_INCREMENT,
  `PatientID` INT NOT NULL,
  `Status` VARCHAR(50) DEFAULT NULL,
  `DeliveryOption` VARCHAR(50) DEFAULT NULL,
  `DateTime` DATETIME DEFAULT CURRENT_TIMESTAMP, -- แก้เป็น DATETIME
  `PharmCounter` VARCHAR(10) DEFAULT NULL,
  `DoctorID` INT DEFAULT NULL,
  `PrescriptionID` VARCHAR(100) DEFAULT NULL
  -- FOREIGN KEY จะถูกเพิ่มตอนท้าย
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Queues`
--

LOCK TABLES `Queues` WRITE;
/*!40000 ALTER TABLE `Queues` DISABLE KEYS */;
INSERT INTO `Queues` VALUES (4,3,'done','delivery','2023-01-15 09:12:56','-',1,'RX1761729176801'),(6,2,'done','delivery','2023-06-10 14:33:11','-',1,'RX1761729176801'),(7,5,'done','delivery','2023-08-03 11:25:47','-',1,'RX1761729176801'),(8,6,'done','delivery','2023-12-18 16:02:09','-',1,'RX1761729176801'),(9,1,'done','delivery','2024-01-12 08:15:23','-',1,'RX1761729176801'),(10,2,'done','delivery','2024-02-27 09:40:18','-',1,'RX1761729176801'),(11,3,'done','delivery','2024-03-15 10:50:44','-',1,'RX1761729176801'),(13,5,'done','delivery','2024-06-29 15:22:51','-',1,'RX1761729176801'),(14,6,'done','delivery','2024-09-14 09:05:37','-',1,'RX1761729176801'),(15,1,'done','delivery','2024-10-25 07:49:12','-',1,'RX1761729176801'),(16,3,'done','delivery','2024-12-31 11:59:59','-',1,'RX1761729176801'),(17,2,'done','delivery','2025-01-09 09:12:56','-',1,'RX1761729176801'),(18,5,'done','delivery','2025-03-17 11:47:22','-',1,'RX1761729176801'),(19,6,'done','delivery','2025-05-25 14:23:40','-',1,'RX1761729176801'),(20,3,'done','delivery','2025-07-11 08:32:11','-',1,'RX1761729176801'),(22,1,'done','delivery','2025-10-29 09:12:56','-',1,'RX1761729176801'),(23,2,'done','delivery','2025-12-18 15:55:21','-',1,'RX1761729176801'),(24,12,'done','delivery','2024-06-29 15:22:51','-',1,'RX1761729176801'),(25,11,'done','delivery','2024-06-29 16:22:51','-',1,'RX1761729176801'),(26,16,'done','delivery','2024-06-29 17:22:51','-',1,'RX1761729176801'),(27,18,'done','delivery','2024-09-14 16:05:37','-',1,'RX1761729176801'),(28,108,'done','delivery','2024-03-15 15:22:51','-',1,'RX1761729176801'),(29,102,'done','delivery','2024-03-15 11:22:51','-',1,'RX1761729176801'),(30,99,'done','delivery','2024-02-27 16:22:51','-',1,'RX1761729176801'),(31,4,'waiting','','2025-10-30 12:28:44','-',1,'RX1761827324381'),(32,1,'waiting','','2025-10-30 12:30:17','-',1,'RX1761827417418');
/*!40000 ALTER TABLE `Queues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Staff`
--

DROP TABLE IF EXISTS `Staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Staff` (
  `StaffID` INT PRIMARY KEY AUTO_INCREMENT,
  `CognitoSub` VARCHAR(255) UNIQUE NOT NULL,
  `Role` VARCHAR(50) NOT NULL,
  `Name` VARCHAR(255) NOT NULL,
  `Surname` VARCHAR(255) NOT NULL,
  `LicenseID` VARCHAR(100) NOT NULL,
  `Gender` VARCHAR(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Staff`
--

LOCK TABLES `Staff` WRITE;
/*!40000 ALTER TABLE `Staff` DISABLE KEYS */;
INSERT INTO `Staff` VALUES (1,'64088428-3071-7002-38cf-339a0ac2d6b4','doctor','นพ.วรวุฒิ','กิตติเทพพิธาสถิตเวหา','xxx-xxx-xxx','ชาย'),(2,'c40864f8-70e1-700a-e9d0-276fa582003e','pharmacist','เภสัช','หมายเลข1','xxx-xxx-xxx','ชาย');
/*!40000 ALTER TABLE `Staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- (ผมลบตาราง `sqlite_sequence` ทิ้ง เพราะ MySQL ไม่ได้ใช้ครับ)
--

--
-- เพิ่ม FOREIGN KEYS ที่ถูกต้องกลับเข้ามา
-- (เราเพิ่มตอนท้ายเพื่อให้แน่ใจว่าข้อมูลถูกโหลดเข้าไปก่อน)
--

ALTER TABLE `Prescription` ADD FOREIGN KEY (`DrugID`) REFERENCES `Drug`(`DrugID`);
ALTER TABLE `Queues` ADD FOREIGN KEY (`PatientID`) REFERENCES `Patient`(`PatientID`);
ALTER TABLE `Queues` ADD FOREIGN KEY (`DoctorID`) REFERENCES `Staff`(`StaffID`);


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 19:23:32