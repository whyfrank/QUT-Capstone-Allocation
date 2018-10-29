-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.11 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for capstone
CREATE DATABASE IF NOT EXISTS `capstone` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `capstone`;

-- Dumping structure for table capstone.project
CREATE TABLE IF NOT EXISTS `project` (
  `project_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(50) NOT NULL,
  `project_name` varchar(50) NOT NULL,
  `industry` varchar(50) NOT NULL,
  `about_company` mediumtext,
  `description` mediumtext NOT NULL,
  `project_output_type` varchar(50) DEFAULT NULL,
  `difficulty` set('Easy','Normal','Hard') DEFAULT NULL,
  `priority` set('Normal','High') DEFAULT NULL,
  `preferred_course_combination` set('CCCI','CCII','CIII') DEFAULT NULL,
  `repeat_partner` tinyint(1) DEFAULT NULL,
  `academic_needed` tinyint(1) DEFAULT NULL,
  `ip_contract_requirement` char(50) DEFAULT NULL,
  `potential_support_level` varchar(50) DEFAULT NULL,
  `company_type` varchar(50) DEFAULT NULL,
  `scope_deliverables` varchar(1000) DEFAULT NULL,
  `allocation_finalized` tinyint(4) DEFAULT NULL,
  `req_knowledge` varchar(1000) DEFAULT NULL,
  `allocated_team` smallint(6) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `abn` varchar(50) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `liaison_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  `academic_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  `partner_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  `team_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `Project_fk0` (`allocated_team`),
  CONSTRAINT `Project_fk0` FOREIGN KEY (`allocated_team`) REFERENCES `team` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.project: ~5 rows (approximately)
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
REPLACE INTO `project` (`project_id`, `company_name`, `project_name`, `industry`, `about_company`, `description`, `project_output_type`, `difficulty`, `priority`, `preferred_course_combination`, `repeat_partner`, `academic_needed`, `ip_contract_requirement`, `potential_support_level`, `company_type`, `scope_deliverables`, `allocation_finalized`, `req_knowledge`, `allocated_team`, `notes`, `abn`, `address`, `liaison_accepted`, `academic_accepted`, `partner_accepted`, `team_accepted`) VALUES
	(1, 'Computers R Us', 'Administration Services', 'Information Technology', 'We do some administration things, and sell computers at the same time.', 'Some snazzy cool admin web portal!', NULL, 'Normal', NULL, 'CCII', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '- Computer Wizardry	- Other wizardry', NULL, NULL, '47 124 274 975', '73 Long Road, Hamsfield QLD 4123', 'Approved', 'Approved', 'Pending', 'Pending'),
	(2, 'IT Support Co', 'Online Booking System', 'Information Technology', 'We do IT support.', 'An online system for clients to book a support session with us.', NULL, 'Normal', NULL, 'CIII', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 3, NULL, '43 847 384 239', '34 Short Road, Brownslopes QLD 4126', 'Approved', 'Approved', 'Approved', 'Approved'),
	(3, 'MacroSoft', 'AdminLTE', 'Information Technology', 'MacroSoft is an IT company.', 'AdminLTE will be a fully responsive admin template. Based on Bootstrap 3 framework. Highly customizable and easy to use. Will fit many screen resolutions from small mobile devices to large desktops.', NULL, 'Hard', NULL, 'CCII', NULL, NULL, NULL, NULL, NULL, '- A project containing the finished product.', NULL, '- Considerable knowledge of Bootstrap 3 and CSS styling', NULL, NULL, '43 847 384 239', '34 Short Road, Brownslopes QLD 4126', 'Approved', 'Approved', 'Pending', 'Pending'),
	(4, 'Forensics IT', 'Security Feature', 'Information Technology', 'Forensics IT is an IT company specializing in Information Security. We provide world-class tools to provide the security goals required by our clients.', 'Work on a functionality on a Cyptographic tool, that will encrypt all entries of a database for maximum security.', '', 'Easy', 'Normal', 'CCCI', 0, 0, '', '', '', '', NULL, '- Cryptography - Australian Privacy Act 1989', NULL, '', '43 847 384 239', '34 Short Road, Brownslopes QLD 4126', 'Approved', 'Pending', 'Pending', 'Pending'),
	(5, 'Garden Store', 'Website Design', 'Information Technology', 'Sells gardening equipment, seeds, plants and more!', 'We aren\'t happy with our current front web-page. So we would like a re-design!', NULL, 'Easy', NULL, 'CCII', NULL, NULL, NULL, NULL, NULL, 'Make a nice little image of a cactus plant appear on our front web-page. :)', NULL, '- Know how to edit images - Know how to use WordPress', 10, NULL, '43 847 384 239', '64 Poorscope Lane, Cleveland QLD 4108', 'Approved', 'Approved', 'Pending', 'Pending');
/*!40000 ALTER TABLE `project` ENABLE KEYS */;

-- Dumping structure for table capstone.project_contacts
CREATE TABLE IF NOT EXISTS `project_contacts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` smallint(6) NOT NULL,
  `first_name` char(50) DEFAULT NULL,
  `last_name` char(50) DEFAULT NULL,
  `title` char(250) DEFAULT NULL,
  `phone` int(11) DEFAULT NULL,
  `email` char(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project` (`project_id`),
  CONSTRAINT `project` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.project_contacts: ~5 rows (approximately)
/*!40000 ALTER TABLE `project_contacts` DISABLE KEYS */;
REPLACE INTO `project_contacts` (`id`, `project_id`, `first_name`, `last_name`, `title`, `phone`, `email`) VALUES
	(1, 1, 'John', 'Smith', 'CEO', 38439393, 'john.smith@email.com'),
	(2, 2, 'Anne', 'Green', 'Business Owner', 38574639, 'anne.green@email.com'),
	(3, 3, 'John', 'Smith', 'CEO', 38439393, 'john.smith@email.com'),
	(4, 5, 'Anne', 'Green', 'Business Owner', 38574639, 'anne.green@email.com'),
	(5, 4, 'John', 'Smith', 'CEO', 38439393, 'john.smith@email.com');
/*!40000 ALTER TABLE `project_contacts` ENABLE KEYS */;

-- Dumping structure for table capstone.project_skills
CREATE TABLE IF NOT EXISTS `project_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` smallint(6) NOT NULL,
  `required` tinyint(1) NOT NULL,
  `skill` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `project_skill` (`skill`),
  CONSTRAINT `project_id` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`),
  CONSTRAINT `project_skill` FOREIGN KEY (`skill`) REFERENCES `skills` (`skill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table capstone.project_skills: ~9 rows (approximately)
/*!40000 ALTER TABLE `project_skills` DISABLE KEYS */;
REPLACE INTO `project_skills` (`id`, `project_id`, `required`, `skill`) VALUES
	(1, 3, 1, 1),
	(2, 3, 1, 4),
	(3, 3, 1, 42),
	(4, 3, 0, 39),
	(5, 4, 1, 14),
	(6, 4, 1, 3),
	(7, 4, 1, 18),
	(8, 4, 1, 37),
	(9, 5, 1, 37);
/*!40000 ALTER TABLE `project_skills` ENABLE KEYS */;

-- Dumping structure for table capstone.skills
CREATE TABLE IF NOT EXISTS `skills` (
  `skill_id` int(11) NOT NULL AUTO_INCREMENT,
  `skill_name` char(50) NOT NULL,
  `skill_type` enum('General Software Development','Languages','Data Analysis and AI','Business Analysis','UX and Interaction Design') NOT NULL,
  PRIMARY KEY (`skill_id`),
  UNIQUE KEY `skill_name` (`skill_name`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.skills: ~42 rows (approximately)
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
REPLACE INTO `skills` (`skill_id`, `skill_name`, `skill_type`) VALUES
	(1, 'Back-End Web Development', 'General Software Development'),
	(2, 'Security', 'General Software Development'),
	(3, 'Networks', 'General Software Development'),
	(4, 'Front-End Web Development', 'General Software Development'),
	(5, 'Functional Programming', 'General Software Development'),
	(6, 'Database Administration', 'General Software Development'),
	(7, 'Cloud computing', 'General Software Development'),
	(8, 'Games Development', 'General Software Development'),
	(9, 'Mobile Application Development', 'General Software Development'),
	(10, 'Systems Programming', 'General Software Development'),
	(11, 'Object Oriented Programming', 'General Software Development'),
	(12, 'Node', 'Languages'),
	(13, 'Python', 'Languages'),
	(14, 'C / C++', 'Languages'),
	(15, 'C# / Java', 'Languages'),
	(16, 'R', 'Languages'),
	(17, 'Ruby', 'Languages'),
	(18, 'SQL', 'Languages'),
	(19, 'Client side Javascript', 'Languages'),
	(20, 'F#', 'Languages'),
	(21, 'Haskell', 'Languages'),
	(22, 'PHP', 'Languages'),
	(23, 'Computer Vision', 'Data Analysis and AI'),
	(24, 'Data Mining', 'Data Analysis and AI'),
	(25, 'Machine learning', 'Data Analysis and AI'),
	(26, 'Statistical Analysis', 'Data Analysis and AI'),
	(27, 'Robotics', 'Data Analysis and AI'),
	(28, 'Text Processing and Information Retrieval\r\n', 'Data Analysis and AI'),
	(29, 'Visual Analytics', 'Data Analysis and AI'),
	(30, 'Business Analysis and Requirements Gathering', 'Business Analysis'),
	(31, 'Business Process Modeling', 'Business Analysis'),
	(32, 'Project management', 'Business Analysis'),
	(33, 'IS Consulting', 'Business Analysis'),
	(34, 'Information systems design', 'Business Analysis'),
	(35, 'Enterprise systems management', 'Business Analysis'),
	(36, 'Data visualisation', 'UX and Interaction Design'),
	(37, 'Interface design', 'UX and Interaction Design'),
	(38, 'Rapid prototyping', 'UX and Interaction Design'),
	(39, 'Interaction/UX design', 'UX and Interaction Design'),
	(40, 'Usability and accessibility evaluation', 'UX and Interaction Design'),
	(41, 'User centred design methods', 'UX and Interaction Design'),
	(42, 'Web design', 'UX and Interaction Design');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;

-- Dumping structure for table capstone.staff
CREATE TABLE IF NOT EXISTS `staff` (
  `staff_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `password` varchar(512) NOT NULL,
  `password_salt` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `qut_email` varchar(50) NOT NULL,
  `staff_type` set('Coordinator','Tutor','Industry Liasion') NOT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.staff: ~3 rows (approximately)
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
REPLACE INTO `staff` (`staff_id`, `password`, `password_salt`, `first_name`, `last_name`, `qut_email`, `staff_type`) VALUES
	(1, '479a8aa362e560535db0d4f6870ba69d72d5bcb9559d2db76e28ceeeff8004c9757e39d4a634dc516f614a31b24198c063e3629a48b362b60a9c049e1ebcf3a6', '128f2c244a6a7023', 'Seth', 'Heathers', 'seth.heathers@hdr.qut.edu.au', 'Coordinator'),
	(2, '9a216756154a1044a97ddfc5c226f40b04202563fa9d86bd112aa5f734e741c586139baaa890d627b0a40ca8e792477c01f0db21ee9e24479530c1f37bb3b8d2', '2da29187d5a2acb2', 'Hajime', 'Mizoguchi', 'hajime.mizoguchi@hdr.qut.edu.au', 'Tutor'),
	(3, '5675673329851a676f2109bf3d47713913380c28aad77d6e4cfa5282d05a57d15e2cbc9b5765912f29bc6389648fdceb66643874e4c89b3014fe87899b835920', '8d6a7dfa3f211103', 'Sam', 'Smith', 'sam.smith@hdr.qut.edu.au', 'Industry Liasion');
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;

-- Dumping structure for table capstone.students
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` int(11) NOT NULL,
  `password` varchar(512) NOT NULL,
  `password_salt` varchar(16) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `qut_email` varchar(50) NOT NULL,
  `gpa` double NOT NULL,
  `course_code` set('IN01') NOT NULL,
  `course_title` varchar(50) NOT NULL,
  `study_area_a` varchar(50) NOT NULL,
  `study_area_b` varchar(50) DEFAULT NULL,
  `goals` mediumtext,
  `urls` json DEFAULT NULL,
  `other_skills` json DEFAULT NULL,
  `phone` char(50) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.students: ~57 rows (approximately)
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
REPLACE INTO `students` (`student_id`, `password`, `password_salt`, `first_name`, `last_name`, `qut_email`, `gpa`, `course_code`, `course_title`, `study_area_a`, `study_area_b`, `goals`, `urls`, `other_skills`, `phone`) VALUES
	(8114093, 'fad6f9d4050b0fa1b59f9b7f099382469e5a46cb', '3i6j2l', 'Leone', 'Orn', 'leone.orn@connect.qut.edu.au', 5.11, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8173438, '92f69d1d29c5ab44e0632f99407677c3847876d4', '9v5m0r', 'Izabella', 'Emard', 'izabella.emard@connect.qut.edu.au', 6.86, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8179322, 'd633c4190a1842050891549c5b8a75ec76c44430', '7z4b6m', 'Alexandra', 'Fay', 'alexandra.fay@connect.qut.edu.au', 6.32, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8209677, '4479823ed2d76f8f594d89ec6df230d58fa418f6', '6s1o2c', 'Rudy', 'Ritchie', 'rudy.ritchie@connect.qut.edu.au', 6.64, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8215089, '10bc3265521b93aa18750efb30735b5e7a274089', '5w0z2u', 'Angela', 'Deckow', 'angela.deckow@connect.qut.edu.au', 6.73, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8265581, '2cbb6757cf4bc8b908a1ee29c9afd3c38bd4481c', '5o2j4s', 'Alejandrin', 'Hayes', 'alejandrin.hayes@connect.qut.edu.au', 5.34, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8274861, 'c98123397b66a952d030a43aac161c396955446c', '7e0l4u', 'Clinton', 'Lebsack', 'clinton.lebsack@connect.qut.edu.au', 6.16, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8317445, 'bacd1b280bd5d48fa2dc903247db195a144ca2dd', '2z8m6t', 'Cristian', 'Runolfsdottir', 'cristian.runolfsdottir@connect.qut.edu.au', 6.01, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8327724, '6ebd08afe5cffbf08a2dfef7eebb5e9e8ad3e723', '5g2w2n', 'Hayley', 'Olson', 'hayley.olson@connect.qut.edu.au', 5.93, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8332443, '2acf0580b5425cb94309bf69c2c1f254f613c12e', '1n3j1u', 'Thalia', 'Kihn', 'thalia.kihn@connect.qut.edu.au', 6.44, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8341145, '77a928ed576d58fe986c937b84153445c4d13334', '6r3m3p', 'Christopher', 'Hoeger', 'christopher.hoeger@connect.qut.edu.au', 5, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8344907, 'f980e5b3bee787a70300f0981172084f94352a31', '4i3j5k', 'Casper', 'Goldner', 'casper.goldner@connect.qut.edu.au', 6.8, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8398934, 'f29ceb3d8f781d5dccd07d1e7d5939d0a5d37267', '7n9y2k', 'Serena', 'Baumbach', 'serena.baumbach@connect.qut.edu.au', 6.95, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8479089, '4965e0640414ab71eaa0e93a8b0a37762aefbfea', '7e6c1e', 'Jalen', 'Herzog', 'jalen.herzog@connect.qut.edu.au', 6.534, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8571288, 'c524416f052beef611756dffab8b5f6448e4f714', '1r2d7w', 'Rodolfo', 'Ward', 'rodolfo.ward@connect.qut.edu.au', 4.22, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8572833, 'db37043c3c01d76f1d70d8f7053f84dc9c890ca6', '2n0j7v', 'Angelo', 'Schiller', 'angelo.schiller@connect.qut.edu.au', 6.18, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8580874, 'dafbe9415ce19928ddbefb642a2aaae0cee1da84', '1e0u8q', 'Alisa', 'Runte', 'alisa.runte@connect.qut.edu.au', 4.73, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8592721, '602deb4e53a6f4274702cbdd27adb4d146a20767', '8g7b6f', 'Mireya', 'Lueilwitz', 'mireya.lueilwitz@connect.qut.edu.au', 6.75, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8638040, 'f6e6ae57ed498698bcd6240acf8e0b3ed1313b68', '0h8q0u', 'Coby', 'Swift', 'cody.swift@connect.qut.edu.au', 6.3, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(8950198, '5d5958b3f4da0205e0346baba4c49b69d43bef1b', '3v2e3e', 'Celia', 'Smith', 'celia.smith@connect.qut.edu.au', 4.84, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(8951197, '328b74a0dbc03a8e2a3469a539d8676c19623e56', '9w9h3f', 'Kolby', 'Kutch', 'kolby.kutch@connect.qut.edu.au', 4.36, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9022849, 'b0e9412e526332f30c3cf83aa1cf4873eaddf635', '0n1u2q', 'Jewel', 'Rohan', 'jewel.rohan@connect.qut.edu.au', 5.1, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9040492, 'c457648b5ab9f1eabe109ac086861f448e19dd3c', '1o4v0j', 'Imani', 'Wunsch', 'imani.wunsh@connect.qut.edu.au', 6.99, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9101133, '8ad660f06564a163656f096c21526c1a4dfa5021', '9i0c8z', 'Dudley', 'Dicki', 'dudley.dicki@connect.qut.edu.au', 6.1, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9121506, 'acc59357d83e1784d65e27de7fc96e45645a3946', '0m8g2k', 'Emilia', 'Ondricka', 'emilia.ondricka@connect.qut.edu.au', 4.7, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9178395, 'a16511a7bcf3660c5d15e23b052df809f3bd04c4', '5s0a4t', 'Nils', 'Tremblay', 'nils.tremblay@connect.qut.edu.au', 5.52, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9184851, '54a78f9f12d810d0f9d1a4762d8108259dd0694a', '1b2u9g', 'Cecelia', 'Huel', 'cecelia.huel@connect.qut.edu.au', 6.1, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9201172, 'b656bec29007da9495adb3875cd80603dcf4617f', '3j7s9v', 'Ola', 'Romaguera', 'ola.romaguera@connect.qut.edu.au', 6.32, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9221620, 'f9d32aa826708e076817871fe66a4224261476d7', '6r2w7e', 'Lura', 'Murazik', 'lura.murazik@connect.qut.edu.au', 6.1, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9242696, '4a328e792472fdd4e24f1f128fb50f64fbdf0ae2', '2x3z4n', 'Elsa', 'Smitham', 'elsa.smitham@connect.qut.edu.au', 7, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9260009, '3df36f11f4c8c33f5c77ce52a455b1d375e776ac', '2s4q7h', 'Garland', 'Tremblay', 'garland.tremblay@connect.qut.edu.au', 6.3, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9289539, 'c4a9151b87a7f4d0c6c9781998e98ff949460261', '4o2d7a', 'Michelle', 'Bahringer', 'michelle.bahringer@connect.qut.edu.au', 5.1, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9360658, 'ee1b0ead931319f218148319087bb9a427eaaeac', '5o7m0w', 'Dannie', 'Johnston', 'dannie.johnston@connect.qut.edu.au', 5.34, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9372735, 'b22a1146bcc9e83fefe24a7fd573f76812e82eb8', '1k0h0m', 'Justin', 'Barrows', 'justin.barrows@connect.qut.edu.au', 5.32, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9381537, 'de316cc7a0cd4f7b7684abb415cb53d3116d07c8', '0y4o2u', 'Corene', 'Jacobs', 'corene.jacobs@connect.qut.edu.au', 5.83, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9390117, 'eba1f7a9571c41d225d9c69fea29fcd8b3bc4a50', '4d2k7c', 'Arianna', 'Tremblay', 'arianna.tremblay@connect.qut.edu.au', 5.93, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9463782, '6834485d485cfdb3bfbcfa34cdb1a0405b1cf28b8f23db6b7cdb8ac6ddf713e29d659aa111228a8e8e631d5fd589b96ad97d5fe257d17e62e8384a0e52b46ce3', 'ad408823b23ebdbb', 'John', 'Smith', 'john.smith@connect.qut.edu.au', 5.67, 'IN01', 'Bachelor of Information Technology', 'Computer Science', '', 'I want to provide our future Capstone industry partner with a very good quality result!', '["https://www.facebook.com/thejohnsmith/", "https://www.johnsmith.com/", "https://github.com/John-Smith-Modded"]', '["Volunteering at a local cat shelter", "Participating in an amatuer football league"]', '0438437563'),
	(9479106, 'd6654ca64f21dc33a9fc4d2960916a619aab7b18', '0b9p7e', 'Aditya', 'Hermiston', 'aditya.hermiston@connect.qut.edu.au', 5.38, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9516689, '9538acf7eea6ac332a42bb6eb46db1b39eaeceab', '7t0i7n', 'Octavia', 'Greenfelder', 'octavia.greenfelder@connect.qut.edu.au', 6.1, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9526076, '2e013bd68a7a49c17b5a7e53bd322d58258bc6cb', '1g4s8j', 'Lauren', 'Conroy', 'lauren.conroy@connect.qut.edu.au', 5.74, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9567831, '8f51d8d929d2a3f9e4a277c0aa725fec25aba1c2', '4d2q3b', 'Jamarcus', 'Schowalter', 'jamarcus.schowalter@connect.qut.edu.au', 6.2, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9576844, '598d6d595e1c23dd4d28541d004599b7a043fc21', '5d3y3g', 'Manuel', 'Quitzon', 'manuel.quitzon@connect.qut.edu.au', 6.4, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9586280, 'ee81e0f8890fc5887cb149f09a48af7d43e18f34', '5v8f4u', 'Lexus', 'Collier', 'lexus.collier@connect.qut.edu.au', 6.42, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9586854, '2b115cf68526c5a9b4f4beea89facfc6f1e149fe', '8r5o2f', 'Dejah', 'Hoppe', 'deja.hoppe@connect.qut.edu.au', 6.1, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9661074, 'f73e65dc6c379ea1ae3f8eec20616d9fba0a3aa3', '7m1t6r', 'Arlene', 'Jast', 'arlene.jast@connect.qut.edu.au', 6, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9701643, '10299ed002b20e76420eebbf7098d37ecb415920', '1f2r2z', 'Danyka', 'Kerluke', 'danyka.kerluke@connect.qut.edu.au', 5.9, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9746352, 'a', '5u2z0m', 'John', 'Doe', 'john.doe@connect.qut.edu.au', 5.99, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9748375, 'a', '5u2z0m', 'Sam', 'Smith', 'sam.smith@connect.qut.edu.au', 5.99, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9896566, '8de68a55cc8493f3bf4972d9c0877ab0107841be', '5u2z0m', 'Vergie', 'Carroll', 'vergie.carroll@connect.qut.edu.au', 5.99, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9949863, '2dbba3c4428fb294dca1330ac647fe94166b0525', '0v6n2g', 'Mckayla', 'Mohr', 'mckayla.mohr@connect.qut.edu.au', 6.1, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9965906, 'aac5a011305887c4e9fb9b342bbd082b2414c1c3', '6p2s8z', 'Ethyl', 'Hayes', 'ethyl.hayes@connect.qut.edu.au', 5.1, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9979673, '8a336d2bed4cb0327d6745d5010a18dd87d27ea8', '7i4l1u', 'Lavinia', 'Hahn', 'lavinia.hahn@connect.qut.edu.au', 4.03, 'IN01', 'Information Technology', 'Computer Science', NULL, NULL, NULL, NULL, NULL),
	(9988152, 'e7e3bb7d99c64013d6597238bf5d6cf373714142', '2h8d7u', 'Lillie', 'Berge', 'lillie.berge@connect.qut.edu.au', 7, 'IN01', 'Information Technology', 'Information Systems', NULL, NULL, NULL, NULL, NULL),
	(9999995, 'ac107567c3253248139aa7c7a7e69efabc532b093e32ba09bf02ce5c06dd8f689329afc3680816d1aa70cfcb191f8aba27d1b111c47cfe6677bac054b800d6c3', 'd9dfd509fa5ac3e6', 'Jacinta', 'Green', 'jacinta.green@connect.qut.edu.au', 4.32, 'IN01', 'Bachelor of Information Technology', 'Computer Science', '', 'I have goals', '["https://linkedin/account/kameko.omura"]', '["Drinking coffee"]', '0487346593'),
	(9999996, '72558d11fad210d8c5742d25b0ed5d3533c036efa49403d90d80c3b122f3e811dfe7d5b71a2f8c28b497d130bc65f0565b058f8b34c1a7d79bcb8a0ce4ae8e41', 'cfc5bf2cf4da16fe', 'Kameko', 'Omura', 'kameko.omura@connect.qut.edu.au', 6.75, 'IN01', 'Bachelor of Information Technology', 'Information Systems', '', 'I want to make the Capstone project a great learning tool for my personal growth and development. I also strive to give our clients our best effort.', '["https://linkedin/account/kameko.omura", "https://www.kameko-omura.co.jp/"]', '["Run a YouTube series on programming tutorials"]', '0473648574'),
	(9999997, 'b6f0c6c27978b1a272f7e054124acc91449aac5e5d98bc2f4f21c5a5e725215c41cb52ea219a98502cec8d6e08e29388b1da6cfcf253a3d8872b9e277e6075e5', '46c7a16dd4000c1a', 'Pierre', 'Morgan', 'pierre.morgan@connect.qut.edu.au', 6.87, 'IN01', 'Bachelor of Information Technology', 'Computer Science', '', 'Going to places. I will ensure we produce amazing results for our clients.', '["https://linkedin/account/pierre-morgan", "https://github.com/pierremorgan/"]', '["Regular attender of hackathons", "Regular volunteer at expos"]', '0484659934'),
	(9999998, '43514bdecf1fbfb1cb5c98a735e98cdc88c8ae515a503ac81a9b8ab4ddf73617e86645d361362ebe984991979e014ecf3bfaafb6761bbe35751641777368c22f', 'ea40285686ff2b1b', 'Claire', 'Parker', 'claire.parker@connect.qut.edu.au', 6.76, 'IN01', 'Bachelor of Information Technology', 'Information Systems', '', 'My goal is to apply the very best of my skills I have gained so far in this degree, to the project at hand, regardless of the client.', '["https://www.facebook.com/claireparker/", "https://github.com/claireparker/"]', '["Likes to drink coffee", "Travel"]', '0434875649');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;

-- Dumping structure for table capstone.students_in_teams
CREATE TABLE IF NOT EXISTS `students_in_teams` (
  `student_id` int(11) NOT NULL,
  `team_id` smallint(6) NOT NULL,
  `master` tinyint(1) DEFAULT NULL,
  `is_approved` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`student_id`),
  KEY `team` (`team_id`),
  CONSTRAINT `student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `team` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.students_in_teams: ~34 rows (approximately)
/*!40000 ALTER TABLE `students_in_teams` DISABLE KEYS */;
REPLACE INTO `students_in_teams` (`student_id`, `team_id`, `master`, `is_approved`) VALUES
	(8114093, 6, 0, 1),
	(8173438, 3, 0, 1),
	(8215089, 4, 0, 1),
	(8265581, 11, 1, 1),
	(8327724, 7, 0, 1),
	(8332443, 4, 0, 1),
	(8341145, 9, 1, 1),
	(8344907, 6, 0, 1),
	(8592721, 11, 0, 1),
	(8950198, 1, 0, 1),
	(9022849, 2, 1, 1),
	(9101133, 10, 0, 1),
	(9121506, 12, 0, 1),
	(9184851, 2, 0, 1),
	(9221620, 6, 0, 1),
	(9260009, 7, 0, 1),
	(9289539, 7, 0, 1),
	(9372735, 3, 0, 1),
	(9390117, 3, 0, 1),
	(9463782, 8, 1, 1),
	(9516689, 11, 0, 1),
	(9567831, 6, 1, 1),
	(9576844, 5, 0, 1),
	(9586854, 4, 0, 1),
	(9661074, 11, 0, 1),
	(9701643, 4, 1, 1),
	(9746352, 12, 1, 1),
	(9949863, 12, 0, 1),
	(9965906, 3, 1, 1),
	(9979673, 9, 0, 1),
	(9988152, 7, 1, 1),
	(9999995, 8, 0, 1),
	(9999996, 8, 0, 1),
	(9999997, 8, 0, 1);
/*!40000 ALTER TABLE `students_in_teams` ENABLE KEYS */;

-- Dumping structure for table capstone.student_skills
CREATE TABLE IF NOT EXISTS `student_skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) NOT NULL,
  `skill` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id_for_skills` (`student_id`),
  KEY `student_skill` (`skill`),
  CONSTRAINT `student_id_for_skills` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `student_skill` FOREIGN KEY (`skill`) REFERENCES `skills` (`skill_id`)
) ENGINE=InnoDB AUTO_INCREMENT=448 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.student_skills: ~88 rows (approximately)
/*!40000 ALTER TABLE `student_skills` DISABLE KEYS */;
REPLACE INTO `student_skills` (`id`, `student_id`, `skill`) VALUES
	(325, 9463782, 1),
	(326, 9463782, 2),
	(327, 9463782, 3),
	(328, 9463782, 4),
	(329, 9463782, 6),
	(330, 9463782, 11),
	(331, 9463782, 15),
	(332, 9463782, 18),
	(333, 9463782, 19),
	(334, 9463782, 22),
	(335, 9463782, 42),
	(336, 9999998, 1),
	(337, 9999998, 2),
	(338, 9999998, 3),
	(339, 9999998, 5),
	(340, 9999998, 6),
	(341, 9999998, 7),
	(342, 9999998, 8),
	(343, 9999998, 9),
	(344, 9999998, 10),
	(345, 9999998, 11),
	(346, 9999998, 12),
	(347, 9999998, 13),
	(348, 9999998, 14),
	(349, 9999998, 15),
	(350, 9999998, 16),
	(351, 9999998, 17),
	(352, 9999998, 18),
	(353, 9999998, 19),
	(354, 9999998, 21),
	(355, 9999998, 22),
	(356, 9999998, 26),
	(357, 9999998, 28),
	(358, 9999998, 29),
	(359, 9999998, 30),
	(360, 9999998, 31),
	(361, 9999998, 32),
	(362, 9999998, 33),
	(363, 9999998, 34),
	(364, 9999998, 35),
	(365, 9999998, 36),
	(366, 9999998, 37),
	(367, 9999998, 38),
	(368, 9999998, 39),
	(369, 9999998, 40),
	(370, 9999998, 41),
	(371, 9999998, 42),
	(372, 9999997, 1),
	(373, 9999997, 2),
	(374, 9999997, 3),
	(375, 9999997, 16),
	(376, 9999997, 19),
	(377, 9999997, 22),
	(378, 9999997, 27),
	(379, 9999997, 30),
	(380, 9999997, 35),
	(381, 9999997, 37),
	(382, 9999997, 40),
	(383, 9999997, 41),
	(384, 9999996, 1),
	(385, 9999996, 5),
	(386, 9999996, 26),
	(387, 9999996, 27),
	(388, 9999996, 28),
	(389, 9999996, 29),
	(390, 9999996, 30),
	(391, 9999996, 31),
	(392, 9999996, 32),
	(393, 9999996, 33),
	(394, 9999996, 34),
	(395, 9999996, 35),
	(396, 9999996, 36),
	(397, 9999996, 37),
	(398, 9999996, 38),
	(399, 9999996, 39),
	(400, 9999996, 40),
	(401, 9999996, 41),
	(402, 9999996, 42),
	(403, 9999995, 8),
	(404, 9999995, 12),
	(405, 9999995, 17),
	(406, 9999995, 28),
	(407, 9999995, 29),
	(408, 9999995, 42),
	(443, 9965906, 42),
	(444, 9965906, 1),
	(445, 9999998, 39),
	(446, 9999997, 39),
	(447, 9567831, 42);
/*!40000 ALTER TABLE `student_skills` ENABLE KEYS */;

-- Dumping structure for table capstone.team
CREATE TABLE IF NOT EXISTS `team` (
  `team_id` smallint(6) NOT NULL AUTO_INCREMENT,
  `team_name` varchar(20) NOT NULL,
  `team_ready` tinyint(1) DEFAULT NULL,
  `team_summary` mediumtext,
  `preferred_industry` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.team: ~13 rows (approximately)
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
REPLACE INTO `team` (`team_id`, `team_name`, `team_ready`, `team_summary`, `preferred_industry`) VALUES
	(1, 'Team Price', 0, NULL, 'Health'),
	(2, 'The Good People', 0, NULL, 'Sports'),
	(3, 'Team Flair', 1, NULL, 'Government'),
	(4, 'Terrific Quad Squad', 1, NULL, 'IT'),
	(5, 'HYMN Developers', 0, NULL, 'Economics'),
	(6, 'The Team', 1, NULL, NULL),
	(7, 'IT-Chan', 1, NULL, 'Entertainment'),
	(8, 'C Plus Us', 1, 'Our team includes two Information System students and two Computer Science students, all of whom possess a variety of skills that contribute to a diverse and well-rounded team. Although never working together as a complete team, members have been involved in other projects together with great success. The potential roles and contributions of each team member have been thoroughly discussed and all students share a desire to achieve a high quality project outcome. ', 'Agriculture'),
	(9, 'TODO: Name Here', 0, NULL, NULL),
	(10, 'Justice Developers', 0, NULL, NULL),
	(11, 'Team Awesome', 1, NULL, NULL),
	(12, 'Hype Team', 0, NULL, NULL),
	(13, 'The Coding Group', 0, NULL, NULL);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
