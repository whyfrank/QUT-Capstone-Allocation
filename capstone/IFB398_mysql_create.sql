USE capstone;

CREATE TABLE `Students` (
	`Student ID` smallint NOT NULL AUTO_INCREMENT,
	`Password` varchar(50) NOT NULL,
	`Password Salt` varchar(6) NOT NULL,
	`First Name` varchar(50) NOT NULL,
	`Last Name` varchar(50) NOT NULL,
	`QUT Email` varchar(50) NOT NULL,
	`GPA` DECIMAL NOT NULL,
	`Course Code` set('IN01') NOT NULL,
	`Course Title` varchar(50) NOT NULL,
	`Study Area A` varchar(50) NOT NULL,
	`Study Area B` varchar(50) NOT NULL,
	`Skills` set('AI', 'Cloud Computing') NOT NULL,
	PRIMARY KEY (`Student ID`)
);

CREATE TABLE `Team` (
	`Team ID` smallint NOT NULL,
	`Team Name` varchar(20) NOT NULL,
	`Student 1` smallint NOT NULL,
	`Student 2` smallint NOT NULL,
	`Student 3` smallint NOT NULL,
	`Student 4` smallint NOT NULL,
	`Student 5` smallint NOT NULL,
	PRIMARY KEY (`Team ID`)
);

CREATE TABLE `Project` (
	`Project ID` smallint NOT NULL AUTO_INCREMENT,
	`Company Name` varchar(50) NOT NULL,
	`Project Name` varchar(50) NOT NULL,
	`Industry` varchar(50) NOT NULL,
	`Description` varchar(1000) NOT NULL,
	`Project Output Type` varchar(50) NOT NULL,
	`Difficulty` set('Easy', 'Normal', 'Hard') NOT NULL,
	`Priority` set('Normal', 'High') NOT NULL,
	`Preferred Course Combination` set('CCCI', 'CCII', 'CIII') NOT NULL,
	`Required Skills` set('AI', 'Cloud Computing') NOT NULL,
	`Repeat Partner` bool NOT NULL,
	`Academic Needed` bool NOT NULL,
	`IP Contract Requirement` bool NOT NULL,
	`Potential Support Level` varchar(50) NOT NULL,
	`Company Type` varchar(10) NOT NULL,
	`Scope/Deliverables` varchar(1000) NOT NULL,
	`Allocated Team` smallint NOT NULL,
	`Notes` varchar(1000) NOT NULL,
	`Status` set('Not Assigned', 'Preliminary Assignment', 'Awaiting Contract', 'Assigned') NOT NULL,
	`Contact 1: First Name` varchar(50) NOT NULL,
	`Contact 1: Last Name` varchar(50) NOT NULL,
	`Contact 1: Email` varchar(50) NOT NULL,
	`Contact 2: First Name` varchar(50) NOT NULL,
	`Contact 2: Last Name` varchar(50) NOT NULL,
	`Contact 2: Email` varchar(50) NOT NULL,
	`Phone` smallint NOT NULL,
	`Address` varchar(150) NOT NULL,
	PRIMARY KEY (`Project ID`)
);

CREATE TABLE `Staff` (
	`Staff ID` smallint NOT NULL AUTO_INCREMENT,
	`Password` varchar(50) NOT NULL,
	`Password Salt` varchar(50) NOT NULL,
	`First Name` varchar(50) NOT NULL,
	`Last Name` varchar(50) NOT NULL,
	`QUT Email` varchar(50) NOT NULL,
	`Staff Type` set('Coordinator', 'Tutor', 'Industry Liason') NOT NULL,
	PRIMARY KEY (`Staff ID`)
);

ALTER TABLE `Team` ADD CONSTRAINT `Team_fk0` FOREIGN KEY (`Student 1`) REFERENCES `Students`(`Student ID`);

ALTER TABLE `Team` ADD CONSTRAINT `Team_fk1` FOREIGN KEY (`Student 2`) REFERENCES `Students`(`Student ID`);

ALTER TABLE `Team` ADD CONSTRAINT `Team_fk2` FOREIGN KEY (`Student 3`) REFERENCES `Students`(`Student ID`);

ALTER TABLE `Team` ADD CONSTRAINT `Team_fk3` FOREIGN KEY (`Student 4`) REFERENCES `Students`(`Student ID`);

ALTER TABLE `Team` ADD CONSTRAINT `Team_fk4` FOREIGN KEY (`Student 5`) REFERENCES `Students`(`Student ID`);

ALTER TABLE `Project` ADD CONSTRAINT `Project_fk0` FOREIGN KEY (`Allocated Team`) REFERENCES `Team`(`Team ID`);

