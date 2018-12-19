/*
-- Program name:	Data Definition Queries
-- Author:			 Artem Slivka
-- Date:			   05/23/18
-- Description:	Data Definition Queries for Database project, Step 3
*/

DROP TABLE IF EXISTS `atla_benders`;
DROP TABLE IF EXISTS `atla_characters`;
DROP TABLE IF EXISTS `atla_cities`;

/*Creating Bending table */;
DROP TABLE IF EXISTS `atla_bending`;
CREATE TABLE `atla_bending` (
  `bend_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(100) NOT NULL,
  `rarity` varchar(100) DEFAULT NULL,
  `source` varchar(100) NOT NULL,
  `learned_from` varchar(100) NOT NULL,
  PRIMARY KEY (`bend_id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

/*Inserting data into table */;
INSERT INTO `atla_bending` VALUES (1, 'Airbending','rare','Air','Flying bison'),
 (2, 'Waterbending','common','The Moon and Ocean Spirits','The Moon'), 
 (3,'Earthbending','common','Earth','Badgermoles'), 
 (4, 'Firebending','common','Sun','Dragons'), 
 (5,'Energybending','extremely rare','Spirit of bender','Lion turtle'),
 (6,'Metalbending','rare','Earth','Toph Beifong');

/*Creating Organization table*/; 
DROP TABLE IF EXISTS `atla_org`;
CREATE TABLE `atla_org` (
  `org_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `purpose` varchar(100) NOT NULL,
  `status` varchar(100) NOT NULL,
  `influence` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`org_id`),
  UNIQUE KEY `title` (`title`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

/*Inserting data into table */;
INSERT INTO `atla_org` VALUES (1, 'Team Avatar','Defeat Fire Lord Ozai','Disbanded','Global'), 
(2, 'Kiyoshi Warriors','Defend Kiyoshi Island and Earth Kingdom','Active','Regional'), 
(3,'Air Acolytes','Perpetuate culture/traditions of Air Nomads','Active', 'Global'),
(4,'Order of the White Lotus','Sharing knowledge, training avatar','Active', 'Global');

/*Creating Nation table */;
DROP TABLE IF EXISTS `atla_nation`;
CREATE TABLE `atla_nation` (
  `nation_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `government` varchar(100) NOT NULL,
  `population` int(11) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `capital` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`nation_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

/*Inserting data into nation table */;
INSERT INTO `atla_nation` VALUES (1, 'Earth Kingdom','constitutional monarchy',20630000,'Eastern hemisphere','Ba Sing Se'),
(2, 'Fire Nation','absolute monarchy',23100000,'Western hemisphere','Capital City'),
(3, 'Air Nomads','unitary ecclesiocracy',3000,NULL,NULL),
(4, 'Southern Water Tribe','elected chiefdom',200000,'South Pole','South Pole'),
(5, 'Northern Water Tribe','monarchic chiefdom',500000,'North Pole','North Pole');

/*Creating Cities table */;
DROP TABLE IF EXISTS `atla_cities`;
CREATE TABLE `atla_cities` (
  `city_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `population` int(11) NOT NULL,
  `nation` int(11) DEFAULT NULL,
  PRIMARY KEY (`city_id`),
  UNIQUE KEY `name` (`name`),
  KEY `nation` (`nation`),
  CONSTRAINT `atla_cities_1` FOREIGN KEY (`nation`) REFERENCES `atla_nation` (`nation_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

/*Inserting data into cities table */;
INSERT INTO `atla_cities` VALUES (1, 'Ba Sing Se',1250000,1),
(2, 'Fire Fountain City',200000, 2),
(3, 'Capital City',500000, 2),
(4, 'Crescent Island',20000, 2),
(5, 'Northern Air Temple',2000,3),
(6, 'Western Air Temple',1000,3),
(7, 'Omashu',700000,1),
(8, 'Kyoshi Island',100000,1);

/*Creating Character table */;
DROP TABLE IF EXISTS `atla_characters`;
CREATE TABLE `atla_characters` (
  `char_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `nationality` int(11) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `membership` int(11) DEFAULT NULL,
  PRIMARY KEY (`char_id`),
  UNIQUE KEY `name` (`name`),
  KEY `nationality` (`nationality`),
  KEY `membership` (`membership`),
  CONSTRAINT `atla_char_1` FOREIGN KEY (`nationality`) REFERENCES `atla_nation` (`nation_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `atla_char_2` FOREIGN KEY (`membership`) REFERENCES `atla_org` (`org_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

/*Inserting data into character table */;
INSERT INTO `atla_characters` VALUES (1, 'Aang','male',3,12,1),
(2, 'Katara','female',4,14,1),
(3, 'Toph Beifong','female',1,12,1),
(4, 'Sokka','male',4,15,1),
(5, 'Zuko','male',2,16,1),
(6, 'Ozai','male',2,47,NULL),
(7, 'Iroh','male',2,NULL,4),
(8, 'Azula','female',2,14,NULL),
(9, 'Suki','female',1,15,2);


/*Creating Benders relationship table */
DROP TABLE IF EXISTS `atla_benders`;
CREATE TABLE `atla_benders` (
  `char_id` int(11) NOT NULL,
  `bend_id` int(11) NOT NULL,
  PRIMARY KEY (`char_id`,`bend_id`),
  KEY `bend_id` (`bend_id`),
  CONSTRAINT `atla_benders_1` FOREIGN KEY (`char_id`) REFERENCES `atla_characters` (`char_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `atla_benders_2` FOREIGN KEY (`bend_id`) REFERENCES `atla_bending` (`bend_id`) ON DELETE CASCADE ON UPDATE CASCADE 
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Inserting data into benders table */;
INSERT INTO `atla_benders` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(2,2),(3,3),(5,4),(6,4),(7,4),(8,4);
