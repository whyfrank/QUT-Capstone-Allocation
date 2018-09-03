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
  `description` varchar(1000) NOT NULL,
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
  `allocated_team` smallint(6) DEFAULT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `status` set('Not Assigned','Preliminary Assignment','Awaiting Contract','Assigned') NOT NULL,
  `phone` smallint(6) DEFAULT NULL,
  `address` varchar(150) DEFAULT NULL,
  `liaison_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  `academic_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  `partner_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  `team_accepted` enum('Declined','Pending','Approved') DEFAULT NULL,
  PRIMARY KEY (`project_id`),
  KEY `Project_fk0` (`allocated_team`),
  CONSTRAINT `Project_fk0` FOREIGN KEY (`allocated_team`) REFERENCES `team` (`team_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.project: ~0 rows (approximately)
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
REPLACE INTO `project` (`project_id`, `company_name`, `project_name`, `industry`, `description`, `project_output_type`, `difficulty`, `priority`, `preferred_course_combination`, `repeat_partner`, `academic_needed`, `ip_contract_requirement`, `potential_support_level`, `company_type`, `scope_deliverables`, `allocated_team`, `notes`, `status`, `phone`, `address`, `liaison_accepted`, `academic_accepted`, `partner_accepted`, `team_accepted`) VALUES
	(1, 'Computers R Us', 'Administration Services', 'Information Technology', 'Some snazzy cool admin web portal!', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, 'Not Assigned', NULL, NULL, NULL, NULL, NULL, NULL);
/*!40000 ALTER TABLE `project` ENABLE KEYS */;

-- Dumping structure for table capstone.project_contacts
CREATE TABLE IF NOT EXISTS `project_contacts` (
  `id` int(11) NOT NULL,
  `project_id` smallint(6) NOT NULL,
  `first_name` char(50) NOT NULL,
  `last_name` char(50) NOT NULL,
  `phone` int(11) DEFAULT NULL,
  `email` char(80) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project` (`project_id`),
  CONSTRAINT `project` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.project_contacts: ~2 rows (approximately)
/*!40000 ALTER TABLE `project_contacts` DISABLE KEYS */;
REPLACE INTO `project_contacts` (`id`, `project_id`, `first_name`, `last_name`, `phone`, `email`) VALUES
	(1, 1, 'John', 'Smith', 38439393, 'john.smith@email.com'),
	(2, 1, 'Anne', 'Green', 38574639, 'anne.green@email.com');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

-- Dumping data for table capstone.project_skills: ~4 rows (approximately)
/*!40000 ALTER TABLE `project_skills` DISABLE KEYS */;
REPLACE INTO `project_skills` (`id`, `project_id`, `required`, `skill`) VALUES
	(1, 1, 1, 1),
	(2, 1, 1, 4),
	(3, 1, 1, 42),
	(4, 1, 0, 39);
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
  `password` varchar(50) NOT NULL,
  `password_salt` varchar(50) NOT NULL,
  `First_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `qut_email` varchar(50) NOT NULL,
  `staff_type` set('Coordinator','Tutor','Industry Liason') NOT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.staff: ~0 rows (approximately)
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;

-- Dumping structure for table capstone.students
CREATE TABLE IF NOT EXISTS `students` (
  `student_id` int(11) NOT NULL,
  `password` varchar(50) NOT NULL,
  `password_salt` varchar(6) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `qut_email` varchar(50) NOT NULL,
  `gpa` double NOT NULL,
  `course_code` set('IN01') NOT NULL,
  `course_title` varchar(50) NOT NULL,
  `study_area_a` varchar(50) NOT NULL,
  `study_area_b` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.students: ~0 rows (approximately)
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
REPLACE INTO `students` (`student_id`, `password`, `password_salt`, `first_name`, `last_name`, `qut_email`, `gpa`, `course_code`, `course_title`, `study_area_a`, `study_area_b`) VALUES
	(8473843, 'jgf8943u834ut34mtgut8934*&(*(R&*r', '858490', 'Jane', 'Johnson', 'jane.johnson@connect.qut.edu.au', 6.43, 'IN01', 'Information Technology', 'Computer Science', NULL),
	(9375643, 'jgf8943u834ut34mtgut8934*&(*(R&*r', '858490', 'Greg', 'George', 'greg.george@connect.qut.edu.au', 4.32, 'IN01', 'Information Technology', 'Computer Science', NULL),
	(9846473, 'jgf8943u834ut34mtgut8934*&(*(R&*r', '858490', 'George', 'Smith\r\n', 'george.smith@connect.qut.edu.au', 6.75, 'IN01', 'Information Technology', 'Computer Science', NULL);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;

-- Dumping structure for table capstone.students_in_teams
CREATE TABLE IF NOT EXISTS `students_in_teams` (
  `student_id` int(11) NOT NULL,
  `team_id` smallint(6) NOT NULL,
  `master` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `team` (`team_id`),
  CONSTRAINT `student` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `team` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.students_in_teams: ~0 rows (approximately)
/*!40000 ALTER TABLE `students_in_teams` DISABLE KEYS */;
REPLACE INTO `students_in_teams` (`student_id`, `team_id`, `master`) VALUES
	(8473843, 2, 1),
	(9375643, 1, 1),
	(9846473, 1, 0);
/*!40000 ALTER TABLE `students_in_teams` ENABLE KEYS */;

-- Dumping structure for table capstone.student_skills
CREATE TABLE IF NOT EXISTS `student_skills` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `skill` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `student_id_for_skills` (`student_id`),
  KEY `student_skill` (`skill`),
  CONSTRAINT `student_id_for_skills` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  CONSTRAINT `student_skill` FOREIGN KEY (`skill`) REFERENCES `skills` (`skill_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.student_skills: ~0 rows (approximately)
/*!40000 ALTER TABLE `student_skills` DISABLE KEYS */;
REPLACE INTO `student_skills` (`id`, `student_id`, `skill`) VALUES
	(1, 9375643, 1),
	(2, 9375643, 14);
/*!40000 ALTER TABLE `student_skills` ENABLE KEYS */;

-- Dumping structure for table capstone.team
CREATE TABLE IF NOT EXISTS `team` (
  `team_id` smallint(6) NOT NULL,
  `team_name` varchar(20) NOT NULL,
  `team_ready` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table capstone.team: ~0 rows (approximately)
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
REPLACE INTO `team` (`team_id`, `team_name`, `team_ready`) VALUES
	(1, 'SKYG Developers', 0),
	(2, 'Road Code', 0);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

ALTER TABLE `capstone`.`students_in_teams`
ADD COLUMN `is_approved` TINYINT NOT NULL DEFAULT 0 AFTER `master`;
