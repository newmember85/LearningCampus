-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: learningcampus
-- ------------------------------------------------------
-- Server version	8.0.31

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

--
-- Table structure for table `Announcements`
--

DROP TABLE IF EXISTS `Announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `Announcements_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Announcements`
--

LOCK TABLES `Announcements` WRITE;
/*!40000 ALTER TABLE `Announcements` DISABLE KEYS */;
INSERT INTO `Announcements` VALUES (1,'Announcement 1: Test','2021-11-20 22:00:00','2021-11-20 22:00:00',1),(2,'Test 2','2021-11-20 22:00:00','2021-11-20 22:00:00',1),(3,'Test 3','2021-11-20 22:00:00','2021-11-20 22:00:00',1),(4,'KI Text Announcment','2021-11-20 22:00:00','2021-11-20 22:00:00',3);
/*!40000 ALTER TABLE `Announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `CourseContents`
--

DROP TABLE IF EXISTS `CourseContents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `CourseContents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `text` varchar(255) DEFAULT NULL,
  `content_type` varchar(255) DEFAULT NULL,
  `url_path` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `course_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `course_id` (`course_id`),
  CONSTRAINT `CourseContents_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `Courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `CourseContents`
--

LOCK TABLES `CourseContents` WRITE;
/*!40000 ALTER TABLE `CourseContents` DISABLE KEYS */;
INSERT INTO `CourseContents` VALUES (1,'Titel 1','Ich bin ein Text.','Text',NULL,'2021-11-20 22:00:00','2021-11-20 22:00:00',1),(2,'Bild 1',NULL,'Image','URL_Path-to-be-determined','2021-11-20 22:00:00','2021-11-20 22:00:00',1),(3,'Inhalt','Noch mehr Text','Text',NULL,'2021-11-20 22:00:00','2021-11-20 22:00:00',1);
/*!40000 ALTER TABLE `CourseContents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Course_Enrollment`
--

DROP TABLE IF EXISTS `Course_Enrollment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Course_Enrollment` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `StudentMatrikelNr` int NOT NULL,
  `CourseId` int NOT NULL,
  PRIMARY KEY (`StudentMatrikelNr`,`CourseId`),
  KEY `CourseId` (`CourseId`),
  CONSTRAINT `Course_Enrollment_ibfk_1` FOREIGN KEY (`StudentMatrikelNr`) REFERENCES `Students` (`matrikel_nr`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Course_Enrollment_ibfk_2` FOREIGN KEY (`CourseId`) REFERENCES `Courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Course_Enrollment`
--

LOCK TABLES `Course_Enrollment` WRITE;
/*!40000 ALTER TABLE `Course_Enrollment` DISABLE KEYS */;
INSERT INTO `Course_Enrollment` VALUES ('2021-11-20 22:00:00','2021-11-20 22:00:00',930001,1),('2021-11-20 22:00:00','2021-11-20 22:00:00',930001,2),('2021-11-20 22:00:00','2021-11-20 22:00:00',930001,3),('2021-11-20 22:00:00','2021-11-20 22:00:00',930002,1),('2021-11-20 22:00:00','2021-11-20 22:00:00',930002,2);
/*!40000 ALTER TABLE `Course_Enrollment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Courses`
--

DROP TABLE IF EXISTS `Courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Courses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `semester` int DEFAULT NULL,
  `is_fwpm` tinyint(1) DEFAULT NULL,
  `lecturer_id` int DEFAULT NULL,
  `degreeProgramme_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lecturer_id` (`lecturer_id`),
  KEY `degreeProgramme_id` (`degreeProgramme_id`),
  CONSTRAINT `Courses_ibfk_1` FOREIGN KEY (`lecturer_id`) REFERENCES `Lecturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Courses_ibfk_2` FOREIGN KEY (`degreeProgramme_id`) REFERENCES `DegreeProgrammes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Courses`
--

LOCK TABLES `Courses` WRITE;
/*!40000 ALTER TABLE `Courses` DISABLE KEYS */;
INSERT INTO `Courses` VALUES (1,'Grundlagen der Informatik','GdI',1,0,1,1),(2,'Stochastik','St',2,0,2,1),(3,'Künstliche Intelligenz','KI',4,1,1,1);
/*!40000 ALTER TABLE `Courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DegreeProgrammes`
--

DROP TABLE IF EXISTS `DegreeProgrammes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DegreeProgrammes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `semester_count` int DEFAULT NULL,
  `fakulty_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fakulty_id` (`fakulty_id`),
  CONSTRAINT `DegreeProgrammes_ibfk_1` FOREIGN KEY (`fakulty_id`) REFERENCES `Fakulties` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DegreeProgrammes`
--

LOCK TABLES `DegreeProgrammes` WRITE;
/*!40000 ALTER TABLE `DegreeProgrammes` DISABLE KEYS */;
INSERT INTO `DegreeProgrammes` VALUES (1,'Informatik','INF',7,1),(2,'Wirtschaftsinformatik','WIF',7,1),(3,'Holztechnik','HT',7,2);
/*!40000 ALTER TABLE `DegreeProgrammes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Fakulties`
--

DROP TABLE IF EXISTS `Fakulties`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Fakulties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Fakulties`
--

LOCK TABLES `Fakulties` WRITE;
/*!40000 ALTER TABLE `Fakulties` DISABLE KEYS */;
INSERT INTO `Fakulties` VALUES (1,'Informatik'),(2,'Holztechnik');
/*!40000 ALTER TABLE `Fakulties` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Lecturers`
--

DROP TABLE IF EXISTS `Lecturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Lecturers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `abbreviation` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Lecturers`
--

LOCK TABLES `Lecturers` WRITE;
/*!40000 ALTER TABLE `Lecturers` DISABLE KEYS */;
INSERT INTO `Lecturers` VALUES (1,'Schmidt','Franz','SF','ScFr','1234'),(2,'Mayer','Mirko','MM','MaMi','5678');
/*!40000 ALTER TABLE `Lecturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Students`
--

DROP TABLE IF EXISTS `Students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Students` (
  `matrikel_nr` int NOT NULL,
  `surname` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `degree_id` int DEFAULT NULL,
  PRIMARY KEY (`matrikel_nr`),
  KEY `degree_id` (`degree_id`),
  CONSTRAINT `Students_ibfk_1` FOREIGN KEY (`degree_id`) REFERENCES `DegreeProgrammes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Students`
--

LOCK TABLES `Students` WRITE;
/*!40000 ALTER TABLE `Students` DISABLE KEYS */;
INSERT INTO `Students` VALUES (930001,'Mustermann','Max','MuMa','1234',1),(930002,'Hochberger','Ingo','HoIn','5678',2);
/*!40000 ALTER TABLE `Students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'learningcampus'
--

--
-- Dumping routines for database 'learningcampus'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-11-21 22:45:21
