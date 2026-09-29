-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: bus_booking_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '3cd0fce2-368a-11f1-9308-29946a587959:1-131';

--
-- Table structure for table `booking_passengers`
--

DROP TABLE IF EXISTS `booking_passengers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking_passengers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `age` int NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `gender` varchar(20) NOT NULL,
  `passenger_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `seat_number` varchar(10) NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKg23xsssayx3p1pqc9g8cbgm8p` (`booking_id`),
  CONSTRAINT `FKg23xsssayx3p1pqc9g8cbgm8p` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking_passengers`
--

LOCK TABLES `booking_passengers` WRITE;
/*!40000 ALTER TABLE `booking_passengers` DISABLE KEYS */;
INSERT INTO `booking_passengers` VALUES (1,28,'aarav@gmail.com','Male','Aarav Sharma','9841000001','A1',1),(2,26,'pooja@gmail.com','Female','Pooja Sharma','9841000001','A2',1),(3,28,'aarav@gmail.com','Male','Aarav Sharma','9841000001','A2',2),(4,29,'rohan@gmail.com','Male','Rohan Gurung','9841000003','A3',2),(5,24,'bipana@gmail.com','Female','Bipana Thapa','9841000002','B1',3);
/*!40000 ALTER TABLE `booking_passengers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `booking_code` varchar(50) NOT NULL,
  `booking_status` varchar(30) NOT NULL,
  `cancellation_fee` decimal(10,2) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_status` varchar(30) NOT NULL,
  `refund_amount` decimal(10,2) DEFAULT NULL,
  `service_fee` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `tracking_status` varchar(30) NOT NULL,
  `schedule_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKq97166k18hklq6ls46osbrftx` (`booking_code`),
  KEY `FKer0lq2qsui5vv3qn0i6sm1rom` (`schedule_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKer0lq2qsui5vv3qn0i6sm1rom` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'BUS-2026-10291','COMPLETED',0.00,'2026-09-24 06:39:29.974439','PAID',0.00,50.00,2450.00,'ARRIVED',1,4),(2,'BUS-2026-10294','CONFIRMED',0.00,'2026-09-29 04:39:30.010625','PAID',0.00,50.00,2450.00,'BOOKING_CONFIRMED',6,4),(3,'BUS-2026-10280','CANCELLED',100.00,'2026-09-28 06:39:30.017578','REFUNDED',1400.00,50.00,1500.00,'CANCELLED',8,5);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buses`
--

DROP TABLE IF EXISTS `buses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `buses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amenities` text,
  `bus_name` varchar(100) NOT NULL,
  `bus_number` varchar(50) NOT NULL,
  `bus_type` varchar(50) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `seat_capacity` int NOT NULL,
  `status` varchar(30) NOT NULL,
  `operator_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKf0wpejbtx1fk17hi1t6ba5vbv` (`bus_number`),
  KEY `FKj51srt14c3r3qnccxkibt7151` (`operator_id`),
  CONSTRAINT `FKj51srt14c3r3qnccxkibt7151` FOREIGN KEY (`operator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buses`
--

LOCK TABLES `buses` WRITE;
/*!40000 ALTER TABLE `buses` DISABLE KEYS */;
INSERT INTO `buses` VALUES (1,'WiFi, AC, Charging Port, Water Bottle, TV','Mountain Deluxe','BA 2 KHA 1001','AC Deluxe','2026-09-29 06:39:29.293818',30,'ACTIVE',2),(2,'WiFi, AC, Blanket, Water Bottle, TV','Himalayan Express','BA 3 KHA 2002','Super Deluxe','2026-09-29 06:39:29.301136',28,'ACTIVE',2),(3,'WiFi, AC, Sleeper Bed, Water Bottle, Blanket, Charging Port','Greenline Luxury','BA 1 KHA 3003','AC Sleeper','2026-09-29 06:39:29.305613',26,'ACTIVE',3),(4,'WiFi, AC, Music System, Water Bottle','Pokhara Cruiser','BA 2 KHA 4004','Tourist AC','2026-09-29 06:39:29.309697',30,'ACTIVE',3),(5,'WiFi, AC, Charging Port, Reading Light','Lumbini Express','BA 4 KHA 5005','AC Deluxe','2026-09-29 06:39:29.313153',32,'ACTIVE',2),(6,'WiFi, AC, Blanket, Water Bottle, Snacks','Chitwan Safari King','BA 3 KHA 6006','Super Deluxe','2026-09-29 06:39:29.316643',30,'ACTIVE',3),(7,'WiFi, AC, Charging Port, TV','Valley Royal Bus','BA 1 KHA 7007','AC Deluxe','2026-09-29 06:39:29.320815',28,'ACTIVE',2),(8,'WiFi, AC, Sleeper Bed, Blanket, Charging Port, Dinner','Everest Night Cruiser','BA 2 KHA 8008','Luxury Sleeper','2026-09-29 06:39:29.325572',24,'ACTIVE',3);
/*!40000 ALTER TABLE `buses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` text NOT NULL,
  `title` varchar(150) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,'2026-09-29 06:39:30.025413',_binary '\0','Your booking for Kathmandu → Pokhara on 2026-09-30 is confirmed. Seats: A2, A3.','Booking Confirmed: BUS-2026-10294',4),(2,'2026-09-29 06:39:30.029551',_binary '\0','Thank you for joining YatraBus. Enjoy safe and seamless bus bookings across Nepal.','Welcome to YatraBus!',4),(3,'2026-09-29 06:39:30.031601',_binary '\0','Ticket BUS-2026-10280 has been cancelled. A refund of Rs. 1400 has been sent to your payment method.','Refund Initiated: BUS-2026-10280',5);
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `payment_status` varchar(30) NOT NULL,
  `transaction_reference` varchar(100) NOT NULL,
  `booking_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnuscjm6x127hkb15kcb8n56wo` (`booking_id`),
  CONSTRAINT `FKc52o2b1jkxttngufqp3t7jr3h` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,2450.00,'2026-09-29 06:39:30.001279','eSewa','COMPLETED','TXN-99881122',1),(2,2450.00,'2026-09-29 06:39:30.015720','Khalti','COMPLETED','TXN-77334411',2),(3,1500.00,'2026-09-29 06:39:30.021894','Card','REFUNDED','TXN-55442200',3);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cleanliness_rating` int DEFAULT NULL,
  `comfort_rating` int DEFAULT NULL,
  `comment` text,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `service_rating` int DEFAULT NULL,
  `booking_id` bigint NOT NULL,
  `bus_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK3p9j9vyr1qofbcxju65es206r` (`booking_id`),
  KEY `FKpp7hnx7hefo0p6eqnmeacda8o` (`bus_id`),
  KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`),
  CONSTRAINT `FK28an517hrxtt2bsg93uefugrm` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKpp7hnx7hefo0p6eqnmeacda8o` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,5,5,'Excellent journey! The bus departed on time, seats were extremely comfortable, and free WiFi worked well throughout the trip.','2026-09-29 06:39:30.005121',5,5,1,1,4);
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ROLE_ADMIN'),(2,'ROLE_OPERATOR'),(3,'ROLE_USER');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_price` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `destination` varchar(100) NOT NULL,
  `distance` varchar(50) NOT NULL,
  `duration` varchar(50) NOT NULL,
  `source` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (1,1200.00,'2026-09-29 06:39:29.891901','Pokhara','205 km','6 hours','Kathmandu'),(2,1200.00,'2026-09-29 06:39:29.896659','Kathmandu','205 km','6 hours','Pokhara'),(3,950.00,'2026-09-29 06:39:29.899279','Chitwan','160 km','5 hours','Kathmandu'),(4,950.00,'2026-09-29 06:39:29.901937','Kathmandu','160 km','5 hours','Chitwan'),(5,1400.00,'2026-09-29 06:39:29.905809','Butwal','265 km','8 hours','Kathmandu'),(6,1400.00,'2026-09-29 06:39:29.909213','Kathmandu','265 km','8 hours','Butwal'),(7,1600.00,'2026-09-29 06:39:29.913970','Lumbini','300 km','9 hours','Kathmandu'),(8,1600.00,'2026-09-29 06:39:29.917940','Kathmandu','300 km','9 hours','Lumbini'),(9,850.00,'2026-09-29 06:39:29.921685','Chitwan','145 km','4.5 hours','Pokhara'),(10,1900.00,'2026-09-29 06:39:29.926085','Dharan','380 km','11 hours','Kathmandu');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `arrival_time` time(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `departure_time` time(6) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `status` varchar(30) NOT NULL,
  `travel_date` date NOT NULL,
  `bus_id` bigint NOT NULL,
  `route_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpuih24muu99o0lkfkasqh26uj` (`bus_id`),
  KEY `FKc29vj8art9umx13trmnv0pqw7` (`route_id`),
  CONSTRAINT `FKc29vj8art9umx13trmnv0pqw7` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`),
  CONSTRAINT `FKpuih24muu99o0lkfkasqh26uj` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,'13:00:00.000000','2026-09-29 06:39:29.929489','07:00:00.000000',1200.00,'COMPLETED','2026-09-24',1,1),(2,'13:00:00.000000','2026-09-29 06:39:29.935987','07:00:00.000000',1200.00,'ACTIVE','2026-09-29',1,1),(3,'20:00:00.000000','2026-09-29 06:39:29.938567','14:00:00.000000',1250.00,'ACTIVE','2026-09-29',2,1),(4,'13:00:00.000000','2026-09-29 06:39:29.940821','08:00:00.000000',1000.00,'ACTIVE','2026-09-29',3,3),(5,'13:30:00.000000','2026-09-29 06:39:29.943417','07:30:00.000000',1200.00,'ACTIVE','2026-09-29',4,2),(6,'13:00:00.000000','2026-09-29 06:39:29.945623','07:00:00.000000',1200.00,'ACTIVE','2026-09-30',1,1),(7,'01:00:00.000000','2026-09-29 06:39:29.948345','19:00:00.000000',1300.00,'ACTIVE','2026-09-30',2,1),(8,'14:30:00.000000','2026-09-29 06:39:29.952546','06:30:00.000000',1450.00,'ACTIVE','2026-09-30',5,5),(9,'14:00:00.000000','2026-09-29 06:39:29.955888','09:00:00.000000',950.00,'ACTIVE','2026-09-30',6,3),(10,'05:00:00.000000','2026-09-29 06:39:29.958568','20:00:00.000000',1700.00,'ACTIVE','2026-09-30',8,7),(11,'13:00:00.000000','2026-09-29 06:39:29.961356','07:00:00.000000',1400.00,'ACTIVE','2026-10-01',3,1),(12,'12:30:00.000000','2026-09-29 06:39:29.964318','08:00:00.000000',850.00,'ACTIVE','2026-10-01',4,9),(13,'17:00:00.000000','2026-09-29 06:39:29.966857','06:00:00.000000',1900.00,'ACTIVE','2026-10-01',7,10),(14,'13:00:00.000000','2026-09-29 06:39:29.969248','07:00:00.000000',1200.00,'ACTIVE','2026-10-04',1,1),(15,'21:00:00.000000','2026-09-29 06:39:29.972114','15:00:00.000000',1250.00,'ACTIVE','2026-10-04',2,1);
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seats`
--

DROP TABLE IF EXISTS `seats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seats` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) NOT NULL,
  `seat_number` varchar(10) NOT NULL,
  `seat_type` varchar(30) DEFAULT NULL,
  `bus_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKrco1j3ocxdux6go8pn6v8fxsm` (`bus_id`,`seat_number`),
  CONSTRAINT `FKdysgofh5bvo6ijbxunf7x6fa6` FOREIGN KEY (`bus_id`) REFERENCES `buses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=229 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,_binary '','A1','WINDOW',1),(2,_binary '','A2','AISLE',1),(3,_binary '','A3','AISLE',1),(4,_binary '','A4','WINDOW',1),(5,_binary '','B1','WINDOW',1),(6,_binary '','B2','AISLE',1),(7,_binary '','B3','AISLE',1),(8,_binary '','B4','WINDOW',1),(9,_binary '','C1','WINDOW',1),(10,_binary '','C2','AISLE',1),(11,_binary '','C3','AISLE',1),(12,_binary '','C4','WINDOW',1),(13,_binary '','D1','WINDOW',1),(14,_binary '','D2','AISLE',1),(15,_binary '','D3','AISLE',1),(16,_binary '','D4','WINDOW',1),(17,_binary '','E1','WINDOW',1),(18,_binary '','E2','AISLE',1),(19,_binary '','E3','AISLE',1),(20,_binary '','E4','WINDOW',1),(21,_binary '','F1','WINDOW',1),(22,_binary '','F2','AISLE',1),(23,_binary '','F3','AISLE',1),(24,_binary '','F4','WINDOW',1),(25,_binary '','G1','WINDOW',1),(26,_binary '','G2','AISLE',1),(27,_binary '','G3','AISLE',1),(28,_binary '','G4','WINDOW',1),(29,_binary '','H1','WINDOW',1),(30,_binary '','H2','AISLE',1),(31,_binary '','A1','WINDOW',2),(32,_binary '','A2','AISLE',2),(33,_binary '','A3','AISLE',2),(34,_binary '','A4','WINDOW',2),(35,_binary '','B1','WINDOW',2),(36,_binary '','B2','AISLE',2),(37,_binary '','B3','AISLE',2),(38,_binary '','B4','WINDOW',2),(39,_binary '','C1','WINDOW',2),(40,_binary '','C2','AISLE',2),(41,_binary '','C3','AISLE',2),(42,_binary '','C4','WINDOW',2),(43,_binary '','D1','WINDOW',2),(44,_binary '','D2','AISLE',2),(45,_binary '','D3','AISLE',2),(46,_binary '','D4','WINDOW',2),(47,_binary '','E1','WINDOW',2),(48,_binary '','E2','AISLE',2),(49,_binary '','E3','AISLE',2),(50,_binary '','E4','WINDOW',2),(51,_binary '','F1','WINDOW',2),(52,_binary '','F2','AISLE',2),(53,_binary '','F3','AISLE',2),(54,_binary '','F4','WINDOW',2),(55,_binary '','G1','WINDOW',2),(56,_binary '','G2','AISLE',2),(57,_binary '','G3','AISLE',2),(58,_binary '','G4','WINDOW',2),(59,_binary '','A1','WINDOW',3),(60,_binary '','A2','AISLE',3),(61,_binary '','A3','AISLE',3),(62,_binary '','A4','WINDOW',3),(63,_binary '','B1','WINDOW',3),(64,_binary '','B2','AISLE',3),(65,_binary '','B3','AISLE',3),(66,_binary '','B4','WINDOW',3),(67,_binary '','C1','WINDOW',3),(68,_binary '','C2','AISLE',3),(69,_binary '','C3','AISLE',3),(70,_binary '','C4','WINDOW',3),(71,_binary '','D1','WINDOW',3),(72,_binary '','D2','AISLE',3),(73,_binary '','D3','AISLE',3),(74,_binary '','D4','WINDOW',3),(75,_binary '','E1','WINDOW',3),(76,_binary '','E2','AISLE',3),(77,_binary '','E3','AISLE',3),(78,_binary '','E4','WINDOW',3),(79,_binary '','F1','WINDOW',3),(80,_binary '','F2','AISLE',3),(81,_binary '','F3','AISLE',3),(82,_binary '','F4','WINDOW',3),(83,_binary '','G1','WINDOW',3),(84,_binary '','G2','AISLE',3),(85,_binary '','A1','WINDOW',4),(86,_binary '','A2','AISLE',4),(87,_binary '','A3','AISLE',4),(88,_binary '','A4','WINDOW',4),(89,_binary '','B1','WINDOW',4),(90,_binary '','B2','AISLE',4),(91,_binary '','B3','AISLE',4),(92,_binary '','B4','WINDOW',4),(93,_binary '','C1','WINDOW',4),(94,_binary '','C2','AISLE',4),(95,_binary '','C3','AISLE',4),(96,_binary '','C4','WINDOW',4),(97,_binary '','D1','WINDOW',4),(98,_binary '','D2','AISLE',4),(99,_binary '','D3','AISLE',4),(100,_binary '','D4','WINDOW',4),(101,_binary '','E1','WINDOW',4),(102,_binary '','E2','AISLE',4),(103,_binary '','E3','AISLE',4),(104,_binary '','E4','WINDOW',4),(105,_binary '','F1','WINDOW',4),(106,_binary '','F2','AISLE',4),(107,_binary '','F3','AISLE',4),(108,_binary '','F4','WINDOW',4),(109,_binary '','G1','WINDOW',4),(110,_binary '','G2','AISLE',4),(111,_binary '','G3','AISLE',4),(112,_binary '','G4','WINDOW',4),(113,_binary '','H1','WINDOW',4),(114,_binary '','H2','AISLE',4),(115,_binary '','A1','WINDOW',5),(116,_binary '','A2','AISLE',5),(117,_binary '','A3','AISLE',5),(118,_binary '','A4','WINDOW',5),(119,_binary '','B1','WINDOW',5),(120,_binary '','B2','AISLE',5),(121,_binary '','B3','AISLE',5),(122,_binary '','B4','WINDOW',5),(123,_binary '','C1','WINDOW',5),(124,_binary '','C2','AISLE',5),(125,_binary '','C3','AISLE',5),(126,_binary '','C4','WINDOW',5),(127,_binary '','D1','WINDOW',5),(128,_binary '','D2','AISLE',5),(129,_binary '','D3','AISLE',5),(130,_binary '','D4','WINDOW',5),(131,_binary '','E1','WINDOW',5),(132,_binary '','E2','AISLE',5),(133,_binary '','E3','AISLE',5),(134,_binary '','E4','WINDOW',5),(135,_binary '','F1','WINDOW',5),(136,_binary '','F2','AISLE',5),(137,_binary '','F3','AISLE',5),(138,_binary '','F4','WINDOW',5),(139,_binary '','G1','WINDOW',5),(140,_binary '','G2','AISLE',5),(141,_binary '','G3','AISLE',5),(142,_binary '','G4','WINDOW',5),(143,_binary '','H1','WINDOW',5),(144,_binary '','H2','AISLE',5),(145,_binary '','H3','AISLE',5),(146,_binary '','H4','WINDOW',5),(147,_binary '','A1','WINDOW',6),(148,_binary '','A2','AISLE',6),(149,_binary '','A3','AISLE',6),(150,_binary '','A4','WINDOW',6),(151,_binary '','B1','WINDOW',6),(152,_binary '','B2','AISLE',6),(153,_binary '','B3','AISLE',6),(154,_binary '','B4','WINDOW',6),(155,_binary '','C1','WINDOW',6),(156,_binary '','C2','AISLE',6),(157,_binary '','C3','AISLE',6),(158,_binary '','C4','WINDOW',6),(159,_binary '','D1','WINDOW',6),(160,_binary '','D2','AISLE',6),(161,_binary '','D3','AISLE',6),(162,_binary '','D4','WINDOW',6),(163,_binary '','E1','WINDOW',6),(164,_binary '','E2','AISLE',6),(165,_binary '','E3','AISLE',6),(166,_binary '','E4','WINDOW',6),(167,_binary '','F1','WINDOW',6),(168,_binary '','F2','AISLE',6),(169,_binary '','F3','AISLE',6),(170,_binary '','F4','WINDOW',6),(171,_binary '','G1','WINDOW',6),(172,_binary '','G2','AISLE',6),(173,_binary '','G3','AISLE',6),(174,_binary '','G4','WINDOW',6),(175,_binary '','H1','WINDOW',6),(176,_binary '','H2','AISLE',6),(177,_binary '','A1','WINDOW',7),(178,_binary '','A2','AISLE',7),(179,_binary '','A3','AISLE',7),(180,_binary '','A4','WINDOW',7),(181,_binary '','B1','WINDOW',7),(182,_binary '','B2','AISLE',7),(183,_binary '','B3','AISLE',7),(184,_binary '','B4','WINDOW',7),(185,_binary '','C1','WINDOW',7),(186,_binary '','C2','AISLE',7),(187,_binary '','C3','AISLE',7),(188,_binary '','C4','WINDOW',7),(189,_binary '','D1','WINDOW',7),(190,_binary '','D2','AISLE',7),(191,_binary '','D3','AISLE',7),(192,_binary '','D4','WINDOW',7),(193,_binary '','E1','WINDOW',7),(194,_binary '','E2','AISLE',7),(195,_binary '','E3','AISLE',7),(196,_binary '','E4','WINDOW',7),(197,_binary '','F1','WINDOW',7),(198,_binary '','F2','AISLE',7),(199,_binary '','F3','AISLE',7),(200,_binary '','F4','WINDOW',7),(201,_binary '','G1','WINDOW',7),(202,_binary '','G2','AISLE',7),(203,_binary '','G3','AISLE',7),(204,_binary '','G4','WINDOW',7),(205,_binary '','A1','WINDOW',8),(206,_binary '','A2','AISLE',8),(207,_binary '','A3','AISLE',8),(208,_binary '','A4','WINDOW',8),(209,_binary '','B1','WINDOW',8),(210,_binary '','B2','AISLE',8),(211,_binary '','B3','AISLE',8),(212,_binary '','B4','WINDOW',8),(213,_binary '','C1','WINDOW',8),(214,_binary '','C2','AISLE',8),(215,_binary '','C3','AISLE',8),(216,_binary '','C4','WINDOW',8),(217,_binary '','D1','WINDOW',8),(218,_binary '','D2','AISLE',8),(219,_binary '','D3','AISLE',8),(220,_binary '','D4','WINDOW',8),(221,_binary '','E1','WINDOW',8),(222,_binary '','E2','AISLE',8),(223,_binary '','E3','AISLE',8),(224,_binary '','E4','WINDOW',8),(225,_binary '','F1','WINDOW',8),(226,_binary '','F2','AISLE',8),(227,_binary '','F3','AISLE',8),(228,_binary '','F4','WINDOW',8);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `profile_image` varchar(500) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-09-29 06:39:29.248989','admin@yatrabus.com','Super Admin','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9800000001',NULL,'ACTIVE',1),(2,'2026-09-29 06:39:29.263553','operator1@sajhayatayat.com','Sajha Yatayat Operations','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9811111111',NULL,'ACTIVE',2),(3,'2026-09-29 06:39:29.268203','operator2@greenline.com','Greenline Tours','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9822222222',NULL,'ACTIVE',2),(4,'2026-09-29 06:39:29.272549','aarav@gmail.com','Aarav Sharma','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9841000001',NULL,'ACTIVE',3),(5,'2026-09-29 06:39:29.276829','bipana@gmail.com','Bipana Thapa','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9841000002',NULL,'ACTIVE',3),(6,'2026-09-29 06:39:29.280272','chandra@gmail.com','Chandra Gurung','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9841000003',NULL,'ACTIVE',3),(7,'2026-09-29 06:39:29.284281','deepa@gmail.com','Deepa Adhikari','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9841000004',NULL,'ACTIVE',3),(8,'2026-09-29 06:39:29.288712','elina@gmail.com','Elina Maharjan','$2a$10$NjLbw6SbK1zyJonSZ.PNGuLxcQnHMvK0WJs.8wKNdU0aEVb8DNEBm','9841000005',NULL,'ACTIVE',3);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-29 12:26:24
