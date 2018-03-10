CREATE TABLE IF NOT EXISTS `club` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `configuration` (
  `name` varchar(255) NOT NULL,
  `value` json DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `discipline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT '0',
  `tournament` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `discipline_tournament_name` (`name`,`tournament`),
  KEY `fk_286259adff9483a0c1a8a53bb27` (`tournament`),
  CONSTRAINT `fk_286259adff9483a0c1a8a53bb27` FOREIGN KEY (`tournament`) REFERENCES `tournament` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `division` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT '0',
  `type` int(11) NOT NULL,
  `min` int(11) DEFAULT NULL,
  `max` int(11) DEFAULT NULL,
  `tournament` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `division_tournament_name` (`name`,`tournament`),
  KEY `fk_f45766d480610bcd7f24fe13dde` (`tournament`),
  CONSTRAINT `fk_f45766d480610bcd7f24fe13dde` FOREIGN KEY (`tournament`) REFERENCES `tournament` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `gymnast` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `birthYear` int(11) NOT NULL,
  `birthDate` datetime DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `gender` int(11) NOT NULL,
  `allergies` varchar(255) DEFAULT NULL,
  `guardian1` varchar(255) DEFAULT NULL,
  `guardian2` varchar(255) DEFAULT NULL,
  `guardian1Phone` varchar(255) DEFAULT NULL,
  `guardian2Phone` varchar(255) DEFAULT NULL,
  `guardian1Email` varchar(255) DEFAULT NULL,
  `guardian2Email` varchar(255) DEFAULT NULL,
  `club` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `gymnast_club_name` (`name`,`club`),
  KEY `fk_8238c73985217855830dcccf45a` (`club`),
  CONSTRAINT `fk_8238c73985217855830dcccf45a` FOREIGN KEY (`club`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `gymnast_team_team_id` (
  `gymnastId` int(11) NOT NULL,
  `teamId` int(11) NOT NULL,
  PRIMARY KEY (`gymnastId`,`teamId`),
  KEY `fk_9077dcc9ec4dfc5603e529e0333` (`teamId`),
  CONSTRAINT `fk_5f584c2a932b898b7609b4a2c6e` FOREIGN KEY (`gymnastId`) REFERENCES `gymnast` (`id`),
  CONSTRAINT `fk_9077dcc9ec4dfc5603e529e0333` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `gymnast_troop_troop_id` (
  `gymnastId` int(11) NOT NULL,
  `troopId` int(11) NOT NULL,
  PRIMARY KEY (`gymnastId`,`troopId`),
  KEY `fk_1cd6ace6b244df1293b2f31b24c` (`troopId`),
  CONSTRAINT `fk_1cd6ace6b244df1293b2f31b24c` FOREIGN KEY (`troopId`) REFERENCES `troop` (`id`),
  CONSTRAINT `fk_28fcfed250a8381d4e53432fb22` FOREIGN KEY (`gymnastId`) REFERENCES `gymnast` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `media` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(100) NOT NULL,
  `originalName` varchar(100) NOT NULL,
  `mimeType` varchar(50) NOT NULL,
  `discipline` int(11) NOT NULL,
  `team` int(11) NOT NULL,
  `tournament` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filename` (`filename`),
  KEY `fk_3271bd13f86703b9936c86f4814` (`discipline`),
  KEY `fk_ebf82b8816690f4d03087f8c8ac` (`team`),
  KEY `fk_379957346e4e23316fa6ff2f2a5` (`tournament`),
  CONSTRAINT `fk_3271bd13f86703b9936c86f4814` FOREIGN KEY (`discipline`) REFERENCES `discipline` (`id`),
  CONSTRAINT `fk_379957346e4e23316fa6ff2f2a5` FOREIGN KEY (`tournament`) REFERENCES `tournament` (`id`),
  CONSTRAINT `fk_ebf82b8816690f4d03087f8c8ac` FOREIGN KEY (`team`) REFERENCES `team` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `migrations` (
  `timestamp` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `value` int(11) NOT NULL,
  `updated` datetime(6) DEFAULT CURRENT_TIMESTAMP(6),
  `judgeIndex` int(11) DEFAULT NULL,
  `scoreGroup` int(11) NOT NULL,
  `participant` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_900386d6ebdc4910836d7aee01e` (`scoreGroup`),
  KEY `fk_a6d84b99f8eab337604174efa81` (`participant`),
  CONSTRAINT `fk_900386d6ebdc4910836d7aee01e` FOREIGN KEY (`scoreGroup`) REFERENCES `score_group` (`id`),
  CONSTRAINT `fk_a6d84b99f8eab337604174efa81` FOREIGN KEY (`participant`) REFERENCES `team_in_discipline` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `score_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(255) NOT NULL,
  `operation` int(11) NOT NULL,
  `judges` int(11) NOT NULL,
  `max` int(11) NOT NULL,
  `min` int(11) NOT NULL,
  `discipline` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_188b65f4552b1ea66eb28e77dec` (`discipline`),
  CONSTRAINT `fk_188b65f4552b1ea66eb28e77dec` FOREIGN KEY (`discipline`) REFERENCES `discipline` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `team` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `class` int(11) NOT NULL DEFAULT '2',
  `club` int(11) NOT NULL,
  `tournament` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_name_tournament` (`name`,`tournament`),
  KEY `fk_87d06fb83f8ad2504e3a5dd2e24` (`club`),
  KEY `fk_737bee0025023d40c8825eace59` (`tournament`),
  CONSTRAINT `fk_737bee0025023d40c8825eace59` FOREIGN KEY (`tournament`) REFERENCES `tournament` (`id`),
  CONSTRAINT `fk_87d06fb83f8ad2504e3a5dd2e24` FOREIGN KEY (`club`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `team_disciplines_discipline_id` (
  `teamId` int(11) NOT NULL,
  `disciplineId` int(11) NOT NULL,
  PRIMARY KEY (`teamId`,`disciplineId`),
  KEY `fk_b266402660192b88d5d6a011313` (`disciplineId`),
  CONSTRAINT `fk_2960026f49db747524f27039b90` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`),
  CONSTRAINT `fk_b266402660192b88d5d6a011313` FOREIGN KEY (`disciplineId`) REFERENCES `discipline` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `team_divisions_division_id` (
  `teamId` int(11) NOT NULL,
  `divisionId` int(11) NOT NULL,
  PRIMARY KEY (`teamId`,`divisionId`),
  KEY `fk_f14bd7364ebf1f33f2085cd39f8` (`divisionId`),
  CONSTRAINT `fk_7022b67aae61a7dab0df094549e` FOREIGN KEY (`teamId`) REFERENCES `team` (`id`),
  CONSTRAINT `fk_f14bd7364ebf1f33f2085cd39f8` FOREIGN KEY (`divisionId`) REFERENCES `division` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `team_in_discipline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `startNumber` int(11) NOT NULL,
  `startTime` datetime DEFAULT NULL,
  `endTime` datetime DEFAULT NULL,
  `publishTime` datetime DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '2',
  `tournament` int(11) NOT NULL,
  `discipline` int(11) NOT NULL,
  `team` int(11) NOT NULL,
  `sortNumber` int(11) NOT NULL,
  `markDeleted` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_935c07f1246e097fc1d103eafc4` (`tournament`),
  KEY `fk_d35731ff4f4ae03d1f740e5fe09` (`discipline`),
  KEY `fk_81d716e8505c98c212ced60bbe3` (`team`),
  CONSTRAINT `fk_81d716e8505c98c212ced60bbe3` FOREIGN KEY (`team`) REFERENCES `team` (`id`),
  CONSTRAINT `fk_935c07f1246e097fc1d103eafc4` FOREIGN KEY (`tournament`) REFERENCES `tournament` (`id`),
  CONSTRAINT `fk_d35731ff4f4ae03d1f740e5fe09` FOREIGN KEY (`discipline`) REFERENCES `discipline` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `tournament` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `description_no` text,
  `description_en` text,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `times` json DEFAULT NULL,
  `providesLodging` tinyint(4) NOT NULL DEFAULT '1',
  `providesTransport` tinyint(4) NOT NULL DEFAULT '0',
  `providesBanquet` tinyint(4) NOT NULL DEFAULT '0',
  `createdBy` int(11) NOT NULL,
  `club` int(11) DEFAULT NULL,
  `venue` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_9a17e7d62820cee655505007235` (`createdBy`),
  KEY `fk_e4b6bd7eb8b0dbab93f3dcfed02` (`club`),
  KEY `fk_a7f81eba30f8d1cee7f7b05fca2` (`venue`),
  CONSTRAINT `fk_9a17e7d62820cee655505007235` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_a7f81eba30f8d1cee7f7b05fca2` FOREIGN KEY (`venue`) REFERENCES `venue` (`id`),
  CONSTRAINT `fk_e4b6bd7eb8b0dbab93f3dcfed02` FOREIGN KEY (`club`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `tournament_banquet_gymnast` (
  `tournamentId` int(11) NOT NULL,
  `gymnastId` int(11) NOT NULL,
  PRIMARY KEY (`tournamentId`,`gymnastId`),
  KEY `fk_21569f9fd5e1933d4f35ec0748a` (`gymnastId`),
  CONSTRAINT `fk_21569f9fd5e1933d4f35ec0748a` FOREIGN KEY (`gymnastId`) REFERENCES `gymnast` (`id`),
  CONSTRAINT `fk_cc096c270cf44fe925cbdca8448` FOREIGN KEY (`tournamentId`) REFERENCES `tournament` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `tournament_lodging_gymnast` (
  `tournamentId` int(11) NOT NULL,
  `gymnastId` int(11) NOT NULL,
  PRIMARY KEY (`tournamentId`,`gymnastId`),
  KEY `fk_3f7b344909c5e0650b131e595bf` (`gymnastId`),
  CONSTRAINT `fk_3f7b344909c5e0650b131e595bf` FOREIGN KEY (`gymnastId`) REFERENCES `gymnast` (`id`),
  CONSTRAINT `fk_61b1a1679cf5efa2f7afcfda88c` FOREIGN KEY (`tournamentId`) REFERENCES `tournament` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `tournament_transport_gymnast` (
  `tournamentId` int(11) NOT NULL,
  `gymnastId` int(11) NOT NULL,
  PRIMARY KEY (`tournamentId`,`gymnastId`),
  KEY `fk_b030a0bf8f330592098ba159346` (`gymnastId`),
  CONSTRAINT `fk_b030a0bf8f330592098ba159346` FOREIGN KEY (`gymnastId`) REFERENCES `gymnast` (`id`),
  CONSTRAINT `fk_bde3d2723c6b9ff008f9d29997c` FOREIGN KEY (`tournamentId`) REFERENCES `tournament` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `troop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `club` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_5c9493bdfc7829f45ad6ed1a104` (`club`),
  CONSTRAINT `fk_5c9493bdfc7829f45ad6ed1a104` FOREIGN KEY (`club`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) NOT NULL,
  `role` int(11) NOT NULL,
  `club` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_8345dd22c33edca67bc5426fda1` (`club`),
  CONSTRAINT `fk_8345dd22c33edca67bc5426fda1` FOREIGN KEY (`club`) REFERENCES `club` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `venue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `longitude` varchar(255) NOT NULL,
  `latitude` varchar(255) NOT NULL,
  `address` varchar(200) NOT NULL,
  `rentalCost` int(11) NOT NULL,
  `contact` varchar(200) NOT NULL,
  `contactPhone` int(11) NOT NULL,
  `contactEmail` varchar(100) NOT NULL,
  `capacity` int(11) NOT NULL,
  `createdBy` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `fk_4bef6f74b38a0245a49a5df114b` (`createdBy`),
  CONSTRAINT `fk_4bef6f74b38a0245a49a5df114b` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

INSERT INTO `club` (`id`,`name`) VALUES (1,'HAUGESUND TURNFORENING');

INSERT INTO `configuration` (`name`,`value`) VALUES ('defaultValues','{\"division\": [{\"max\": 11, \"min\": 8, \"name\": \"Aspirant\", \"type\": 1, \"sortOrder\": 0}, {\"max\": 13, \"min\": 11, \"name\": \"Rekrutt\", \"type\": 1, \"sortOrder\": 1}, {\"max\": 17, \"min\": 13, \"name\": \"Junior\", \"type\": 1, \"sortOrder\": 2}, {\"max\": 99, \"min\": 16, \"name\": \"Senior\", \"type\": 1, \"sortOrder\": 3}, {\"name\": \"Mix\", \"type\": 2, \"sortOrder\": 0}, {\"name\": \"Kvinner\", \"type\": 2, \"sortOrder\": 1}, {\"name\": \"Herrer\", \"type\": 2, \"sortOrder\": 2}], \"discipline\": [{\"name\": \"Frittstående\", \"sortOrder\": 0}, {\"name\": \"Trampett\", \"sortOrder\": 1}, {\"name\": \"Tumbling\", \"sortOrder\": 2}], \"scoreGroup\": [{\"max\": 5, \"min\": 0, \"name\": \"Composition\", \"type\": \"C\", \"judges\": 2, \"operation\": 1}, {\"max\": 10, \"min\": 0, \"name\": \"Execution\", \"type\": \"E\", \"judges\": 4, \"operation\": 1}, {\"max\": 5, \"min\": 0, \"name\": \"Difficulty\", \"type\": \"D\", \"judges\": 2, \"operation\": 1}, {\"max\": 5, \"min\": 0, \"name\": \"Adjustments\", \"type\": \"HJ\", \"judges\": 1, \"operation\": 2}]}');
INSERT INTO `configuration` (`name`,`value`) VALUES ('display','{\"display1\": \"{{~#list current len=1 ~}}\\n  {{~#size 3~}}\\n    <b>{{team.name}}</b>\\n  {{~/size~}}\\n  {{#center ~}}\\n    {{~#size 2 ~}}\\n      {{division}} {{discipline.name}}\\n    {{~/size ~}}\\n  {{~/center~}}\\n{{~/list~}}\\n{{#center ~}}\\n  -----------------------------\\n{{~/center~}}\\n{{#list next len=2 ~}}\\n  {{~#size 1~}}\\n    <b>{{team.name}}</b>\\n    {{division}} {{disciplineName}}\\n  {{~/size~}}\\n{{~/list}}\", \"display2\": \"{{~#list published len=1 ~}}\\n  {{~#size 3 ~}}\\n    <b>{{team.name}}</b>\\n  {{~/size~}}\\n  {{~#center ~}}\\n    {{~#size 2 ~}}\\n      {{division}} {{disciplineName}}\\n    {{~/size~}}\\n  {{~/center~}}\\n  {{#center ~}}\\n    -----------------------------\\n  {{~/center~}}\\n  {{#center ~}}\\n    {{#size 5 ~}}\\n      {{#fix total len=3}}{{/fix}}\\n    {{~/size ~}}\\n  {{~/center}}\\n{{/list}}\"}');
INSERT INTO `configuration` (`name`,`value`) VALUES ('scheduleExecutionTime','5');
INSERT INTO `configuration` (`name`,`value`) VALUES ('scheduleTrainingTime','3');

INSERT INTO `discipline` (`id`,`name`,`sortOrder`,`tournament`) VALUES (1,'Trampett',1,1);
INSERT INTO `discipline` (`id`,`name`,`sortOrder`,`tournament`) VALUES (2,'Tumbling',2,1);
INSERT INTO `discipline` (`id`,`name`,`sortOrder`,`tournament`) VALUES (3,'Frittstående',0,1);

INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (1,'Kvinner',1,2,NULL,NULL,1);
INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (2,'Herrer',2,2,NULL,NULL,1);
INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (3,'Mix',0,2,NULL,NULL,1);
INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (4,'Aspirant',0,1,8,11,1);
INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (5,'Rekrutt',1,1,11,13,1);
INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (6,'Junior',2,1,13,17,1);
INSERT INTO `division` (`id`,`name`,`sortOrder`,`type`,`min`,`max`,`tournament`) VALUES (7,'Senior',3,1,16,99,1);

INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (32,'Jesper Danielsen Odland',2009,NULL,'','',1,'','Hanne Lund Odland','','48147154','','halunodl@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (33,'Bjørn Isak Hansen',2009,NULL,'','',1,'','Jessica Elisabeth Hansen','','91118849','','elisa_ne166@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (34,'Sofia Meland',2009,NULL,'','',2,'Glutenfri diett','Anette Meland','','45241170','','anettelura20@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (35,'Torstein Røthing Østensjø',2008,NULL,'','',1,'','Henry Røthing','','92045457','','henrtyrothing@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (36,'Henrik Mittet Kyvik',2008,NULL,'','',1,'','Ruth Kyvik','','48147154','','rkyvik@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (37,'Benjamin Vikse',2008,NULL,'','',1,'','Hilde Vikse','','40470814','','hilde.vikse@live.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (38,'Mathias Hagen',2008,NULL,'','',1,'','Leif Reidar Hagen','','48019003','','leif.r.hagen@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (39,'Frida Eikeskog',2008,NULL,'','',2,'','May Britt Eikeskog','','Mayaeik@hotmail.com','','98499790','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (40,'Vilde Sofie Korneliussen',2008,NULL,'','',2,'','Rikke Grønås','','47245480','','shorti_83@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (41,'Amalie Akernes Skogen',2008,NULL,'','',2,'','Sølvi Akernes','','92879969','','Sa_19@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (42,'Madeleine Bjelland Nordmark',2008,NULL,'','',2,'','Gunn Marit Bjelland','','45141060','','guggholio@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (43,'Andreas Davidsen Finne',2008,NULL,'','',1,'','Ingebjørg Davidsen','Geir Inge Davidsen','91677836','','i-davids@online.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (44,'Elina Rønningen',2007,NULL,'','',2,'','Elisabeth Thorsen','','92259099','','elisabethht@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (45,'Gina Laurense Hevrøy Drivenes',2007,NULL,'','',2,'','Elin Marie Drivenes','Stian Hevrøy','45395806','','bippe79@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (46,'Jonas Osmundsen',2007,NULL,'','',1,'','Janne Osmundsen','','92208330','','janne527@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (47,'Tobias Sandal Sandvik',2006,NULL,'','',1,'','Stine Sandal','','93827937','','stine_sandal@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (48,'Karsten Skaar Hansen',2006,NULL,'','',1,'','Gro Cecilie Hansen','','92257700','','gch@wcl.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (49,'Marius Reksten Ringen',2006,NULL,'','',1,'','Eli Ringen Reksten','','41044380','','eli_ringen@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (50,'Oskar Tomasz Witkowski',2005,NULL,'','',1,'','Beata Wikowski','','96666065','','tomasz.witkowski@haugnett.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (51,'Ariel Christensen',2005,NULL,'','',2,'','Lena Christensen','','90967997','','Lenas2@yahoo.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (52,'Christian Trulsen Hasseløy',2005,NULL,'gunnhelen9@hotmail.com','99341870',2,'','Kai Trulsen','','Kai.trulsen@gmail.com','','93255263','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (53,'Mira Bjelland Amundsen',2005,NULL,'miraprinsessa7@gmail.com','48343217',2,'','Øystein Amundsen','Kari Bjelland Wågen','48019009','90062586','oystein.amundsen@gmail.com','kwaagen@hotmail.com',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (54,'Alva Røthing Østensjø',2005,NULL,'','92689297',2,'','Henry Røthing','','92045457','','henryrothing@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (55,'Malene Asheim Kolstø',2005,NULL,'','93610381',2,'','Benedikte Kolstø','Edvin Asheim','93428102','40674631','Benedikte.k@hotmail.com','Edvinasheim@gmail.com',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (56,'Victoria Olsen Høie',2005,NULL,'','',2,'','Trine Høie Tjøsvoll','','9597392','','traine53@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (57,'Julie Kallevik Melbo',2005,NULL,'','',2,'','Elin Melbo','','92257255','','elinmelbo@yahoo.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (58,'Janne Holgersen',2005,NULL,'','40700176',2,'','Marianne Holgersen','','92054834','','marianne@hohannessen.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (59,'Truls Alvar Sveindal',2005,NULL,'','98447116',1,'','Kirsti Sveindal','Petter Sveindal','47017830','95028187','kirsti@katarsis.no','petter.sveindal@aibel.com',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (60,'Tiril Christine Danielsen',2004,NULL,'','',2,'','Charlotte Bergersen','','45696606','','Charlottebergersen@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (61,'Sigrid Dybvik Ekrene',2004,NULL,'','',2,'','Helene Dybvik Ekrene','','97175815','','heleneekrene@yahoo.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (62,'Madeleine Harveland',2004,NULL,'','45026768',2,'','Anne Beth Harveland','','47240498','','Fam.harveland@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (63,'Benedikte Gundersen',2004,NULL,'','90783695',2,'','Elisabeth Tveit Gundersen','','99612777','','elisabethtg.78@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (64,'Heine Ihle Frøyland',2004,NULL,'','97076213',1,'','Hanne Frøyland Aarekol','','47264763','','hannemoren85@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (65,'Caroline Madsen',2004,NULL,'soira.kvithaug@haugnett.no','95833551',2,'','Alf Ragnar Sørenes','','97191219','','Alf.ragnar.sorenes@afgruppen.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (66,'Joakim Schønningsen',2004,NULL,'','',1,'','Elisabeth Welle','','95065525','','elisabeth_welle@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (67,'Kasper Stokkenes',2004,NULL,'','47239654',1,'','Bente Emberland','Bjørn Willy Stokkenes','46853119','47239654','benteemb@gmail.com','bjorn@adrenasoft.no',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (68,'Gjøran Davick',2004,NULL,'Janickedavick@gmail.com','',1,'','Thor Einar Davick','','47338355','','Tedavick@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (69,'Thea Frøyland',2004,NULL,'','',2,'','Tor Egil Frøyland','','92405507','','gardstol@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (70,'Kiana Rose Winsor',2004,NULL,'','',2,'','Line Winsor','','91349317','','linewinsor@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (71,'Iben Sofie Støyva',2004,NULL,'','',2,'','Marita Kolås','','97589208','','marita.kolas@haugnett.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (72,'Rolf Thomas Grindhaug',2004,NULL,'','',1,'','Christine Grindhaug','','95819988','','cgrindhaug@live.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (73,'Maria Løken Folgerø-Holm',2004,NULL,'','',2,'','Tove Folgerø-Holm','','92264996','','tove.folgero-holm@haugnett.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (74,'Jonas Nilssen',2003,NULL,'','45454602',2,'','Merethe Jørgensen','','97581930','','merethe40@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (75,'Emilie Bratvold',2003,NULL,'','',2,'','Eva Marie Bratvold','','97645601','','evamarie.bratvold@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (76,'Regine Lillebråten Økland',2003,NULL,'','',2,'','Grethe Økland Lillebråten','','93027387','','glille.lillebrten8@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (77,'Torkatla Gydja Armannsdottir',2003,NULL,'','',2,'','Ellen Johannsdottir','','48462826','','ellenosk1@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (78,'Anna Elisabeth Røgenes',2003,NULL,'','41756622',2,'','Agnes Stavland','Kjell Arne Røgenes','92646173','47468002','almagnes@hotmail.com','kjell.arne.rogenes@westcon.no',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (79,'Jørgen Fosen Persson',2002,NULL,'','97900048',1,'','Harald Fosen','','90087627','','Hafose@online.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (80,'Sigurd Kringeland',2002,NULL,'','',1,'','Olaug Sandve','','99168968','','olaug.sandve@gmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (81,'Marius Larsen Sakkestad',2002,NULL,'','',1,'','Geir Sakkestad','','99250636','','gsakkest@online.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (82,'Emma Wulfsberg Kvamme',2001,NULL,'','',2,'','Lise Kvamme Wulfsberg','','90740407','','lise@wulfsberg.org','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (83,'Skage Lysgaard',2000,NULL,'','46681223',1,'','Anders Lysgaard','','48294090','','ande-ly@online.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (84,'Magnus Liabø',2000,NULL,'','',1,'','Kathrine Liabø','','90619533','','kathrine.liabo@haugnett.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (85,'Tor Nedland Skogland',2000,NULL,'','90749060',1,'','Anita V. Skogland','','93200747','','anita@nilssund.no','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (86,'Sverre Normann Hansen',2000,NULL,'','',1,'','Torunn Hansen','','40614356','','torunn.mh.@hotmail.com','',1);
INSERT INTO `gymnast` (`id`,`name`,`birthYear`,`birthDate`,`email`,`phone`,`gender`,`allergies`,`guardian1`,`guardian2`,`guardian1Phone`,`guardian2Phone`,`guardian1Email`,`guardian2Email`,`club`) VALUES (87,'Nina Aalvik',1999,NULL,'','41384145',2,'','Lillian Tjelmeland','','91777306','','aalvik_99@hotmail.com','',1);

INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (32,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (33,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (34,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (35,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (36,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (37,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (38,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (39,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (40,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (41,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (42,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (43,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (44,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (45,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (46,1);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (32,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (33,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (35,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (36,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (37,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (38,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (43,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (46,2);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (34,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (39,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (40,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (41,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (42,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (44,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (45,3);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (47,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (48,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (49,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (50,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (51,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (52,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (53,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (54,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (55,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (56,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (57,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (58,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (59,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (66,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (68,4);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (32,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (33,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (35,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (36,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (37,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (38,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (43,6);
INSERT INTO `gymnast_team_team_id` (`gymnastId`,`teamId`) VALUES (46,6);

INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (32,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (33,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (34,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (35,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (36,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (37,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (38,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (39,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (40,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (41,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (42,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (43,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (44,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (45,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (46,1);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (32,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (33,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (35,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (36,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (37,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (38,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (43,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (46,2);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (34,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (39,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (40,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (41,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (42,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (44,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (45,3);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (47,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (48,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (49,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (50,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (51,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (52,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (53,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (54,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (55,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (56,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (57,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (58,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (59,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (66,4);
INSERT INTO `gymnast_troop_troop_id` (`gymnastId`,`troopId`) VALUES (68,4);



INSERT INTO `migrations` (`timestamp`,`name`) VALUES (1487003618914,'FirstReleaseChanges1487003618914');
INSERT INTO `migrations` (`timestamp`,`name`) VALUES (1494843042816,'ScheduleExecutionTime1494843042816');
INSERT INTO `migrations` (`timestamp`,`name`) VALUES (1504463498765,'AgeLimits1504463498765');
INSERT INTO `migrations` (`timestamp`,`name`) VALUES (1504970861402,'ScheduleTrainingTime1504970861402');
INSERT INTO `migrations` (`timestamp`,`name`) VALUES (1507982943458,'DivisionAgeLimit1507982943458');



INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (1,'Composition','C',1,2,5,0,1);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (2,'Execution','E',1,4,10,0,1);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (3,'Difficulty','D',1,2,5,0,1);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (4,'Adjustments','HJ',2,1,5,0,1);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (5,'Composition','C',1,2,5,0,2);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (6,'Execution','E',1,4,10,0,2);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (7,'Difficulty','D',1,2,5,0,2);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (8,'Adjustments','HJ',2,1,5,0,2);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (9,'Composition','C',1,2,5,0,3);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (10,'Execution','E',1,4,10,0,3);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (11,'Difficulty','D',1,2,5,0,3);
INSERT INTO `score_group` (`id`,`name`,`type`,`operation`,`judges`,`max`,`min`,`discipline`) VALUES (12,'Adjustments','HJ',2,1,5,0,3);

INSERT INTO `team` (`id`,`name`,`class`,`club`,`tournament`) VALUES (1,'haugesund-1',2,1,1);
INSERT INTO `team` (`id`,`name`,`class`,`club`,`tournament`) VALUES (2,'haugesund-2 ',2,1,1);
INSERT INTO `team` (`id`,`name`,`class`,`club`,`tournament`) VALUES (3,'haugesund-3 ',2,1,1);
INSERT INTO `team` (`id`,`name`,`class`,`club`,`tournament`) VALUES (4,'haugesund-4',1,1,1);
INSERT INTO `team` (`id`,`name`,`class`,`club`,`tournament`) VALUES (6,'haugesund-r1',2,1,1);

INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (1,1);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (2,1);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (3,1);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (4,1);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (6,1);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (1,2);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (2,2);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (3,2);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (4,2);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (6,2);
INSERT INTO `team_disciplines_discipline_id` (`teamId`,`disciplineId`) VALUES (6,3);

INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (3,1);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (2,2);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (6,2);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (1,3);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (4,3);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (1,4);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (2,4);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (3,4);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (4,5);
INSERT INTO `team_divisions_division_id` (`teamId`,`divisionId`) VALUES (6,5);

INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (26,5,NULL,NULL,NULL,2,1,1,1,5,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (27,6,NULL,NULL,NULL,2,1,2,1,6,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (29,4,NULL,NULL,NULL,2,1,1,2,4,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (30,3,NULL,NULL,NULL,2,1,2,2,3,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (32,1,NULL,NULL,NULL,2,1,1,3,1,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (33,2,NULL,NULL,NULL,2,1,2,3,2,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (35,10,NULL,NULL,NULL,2,1,1,4,10,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (36,9,NULL,NULL,NULL,2,1,2,4,9,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (48,0,NULL,NULL,NULL,2,1,3,6,0,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (49,7,NULL,NULL,NULL,2,1,1,6,7,0);
INSERT INTO `team_in_discipline` (`id`,`startNumber`,`startTime`,`endTime`,`publishTime`,`type`,`tournament`,`discipline`,`team`,`sortNumber`,`markDeleted`) VALUES (50,8,NULL,NULL,NULL,2,1,2,6,8,0);

INSERT INTO `tournament` (`id`,`name`,`description_no`,`description_en`,`startDate`,`endDate`,`times`,`providesLodging`,`providesTransport`,`providesBanquet`,`createdBy`,`club`,`venue`) VALUES (1,'Test turnering','Vi gleder oss til å ta imot store og små gymnaster fra hele kretsen.\n\nDet er mange påmeldte, og vi ser frem til en lang og kjekk dag i hallen.\n\n\n**Sted:**\nHaraldshallen\nHanne Hauglands veg 8\n5519 Haugesund\n\n\n\n**Dommer & Lagledermøte: ** kl 11.00 *(i kafeen til Turnhallen; nabobygget til Haraldshallen) *\n**Trening:**                                  kl 09.00 – 12.45 \n**Innmarsj:**                                kl 12.45\n**Konkurransestart:**                kl 13.00 \n\nGarderober vil bli merket med lag, og ligger i kjelleren i Haraldshallen.  \n\nLunsj til gymnaster/ trenere kan hentes i kiosken i Haraldshallen fra klokken 11.00.\n\nAspiranter kjører først, innimellom frittstående kjøringene.\nAspirantene vil få utdelt sine premier før vi fortsetter tumbling og trampett kjøringene,\nslik at de ikke trenger å ha hele dagen i hallen.\n\n1/3 premiering for rekrutt, junior og senior.\nDeltakerpremier til alle.\n\n\n\n**Med vennlig hilsen**\n\nTeknisk komite Troppsgymnastikk Haugesund Turnforening\n\n\n\nKontakt personer før og under konkurransen:\nVidar Støyva Vidar:   911 90 991 / vidar@haugnett.no (Påmelding)\nKirsti Sveindal:          470 17 830 / kirsti@katarsis.no (Lagleder-­/dommermøte) \nPetter Reffhaug:       484 46 235 / petter@jyslabra.no (Kretsens representant)','Vi gleder oss til å ta imot store og små gymnaster fra hele kretsen.\n\nDet er mange påmeldte, og vi ser frem til en lang og kjekk dag i hallen.\n\n\n**Sted:**\nHaraldshallen\nHanne Hauglands veg 8\n5519 Haugesund\n\n\n\n**Dommer & Lagledermøte: ** kl 11.00 *(i kafeen til Turnhallen; nabobygget til Haraldshallen) *\n**Trening:**                                  kl 09.00 – 12.45 \n**Innmarsj:**                                kl 12.45\n**Konkurransestart:**                kl 13.00 \n\nGarderober vil bli merket med lag, og ligger i kjelleren i Haraldshallen.  \n\nLunsj til gymnaster/ trenere kan hentes i kiosken i Haraldshallen fra klokken 11.00.\n\nAspiranter kjører først, innimellom frittstående kjøringene.\nAspirantene vil få utdelt sine premier før vi fortsetter tumbling og trampett kjøringene,\nslik at de ikke trenger å ha hele dagen i hallen.\n\n1/3 premiering for rekrutt, junior og senior.\nDeltakerpremier til alle.\n\n\n\n**Med vennlig hilsen**\n\nTeknisk komite Troppsgymnastikk Haugesund Turnforening\n\n\n\nKontakt personer før og under konkurransen:\nVidar Støyva Vidar:   911 90 991 / vidar@haugnett.no (Påmelding)\nKirsti Sveindal:          470 17 830 / kirsti@katarsis.no (Lagleder-­/dommermøte) \nPetter Reffhaug:       484 46 235 / petter@jyslabra.no (Kretsens representant)','2018-03-14 23:00:00.000','2018-03-15 23:00:00.000','[{\"day\": 0, \"time\": \"12,18\"}, {\"day\": 1, \"time\": \"12,18\"}]',0,0,0,1,1,1);







INSERT INTO `troop` (`id`,`name`,`club`) VALUES (1,'haugesund-1',1);
INSERT INTO `troop` (`id`,`name`,`club`) VALUES (2,'haugesund-2',1);
INSERT INTO `troop` (`id`,`name`,`club`) VALUES (3,'haugesund-3',1);
INSERT INTO `troop` (`id`,`name`,`club`) VALUES (4,'haugesund-4',1);

INSERT INTO `user` (`id`,`name`,`email`,`password`,`role`,`club`) VALUES (1,'admin',NULL,'$2a$08$1L59S.CUKs6Sq23eq8B4xup0QJZ31QLtdQyOyQsvlxf0PqfQeltw6',99,NULL);

INSERT INTO `venue` (`id`,`name`,`longitude`,`latitude`,`address`,`rentalCost`,`contact`,`contactPhone`,`contactEmail`,`capacity`,`createdBy`) VALUES (1,'Haraldshallen','5.280322','59.4236909','Hanne Hauglands veg 8, 5519 Haugesund, Norway',50000,'Vet ikke',11112222,'asdfadsf@asdfadsf.no',2000,1);