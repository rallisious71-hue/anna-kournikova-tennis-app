CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`team1Player1` varchar(255) NOT NULL,
	`team1Player2` varchar(255) NOT NULL,
	`team2Player1` varchar(255) NOT NULL,
	`team2Player2` varchar(255) NOT NULL,
	`team1Sets` int NOT NULL DEFAULT 0,
	`team2Sets` int NOT NULL DEFAULT 0,
	`team1Games` int NOT NULL DEFAULT 0,
	`team2Games` int NOT NULL DEFAULT 0,
	`winner` int,
	`matchDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playerStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`playerName` varchar(255) NOT NULL,
	`matchesPlayed` int NOT NULL DEFAULT 0,
	`matchesWon` int NOT NULL DEFAULT 0,
	`setsWon` int NOT NULL DEFAULT 0,
	`gamesWon` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `playerStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `playerStats_playerName_unique` UNIQUE(`playerName`)
);
