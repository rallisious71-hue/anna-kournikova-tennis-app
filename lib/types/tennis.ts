/**
 * Tennis App Data Types
 */

export interface Match {
  id: number;
  team1Player1: string;
  team1Player2: string;
  team2Player1: string;
  team2Player2: string;
  team1Sets: number;
  team2Sets: number;
  team1Games: number;
  team2Games: number;
  winner?: number; // 1 for Team 1, 2 for Team 2
  matchDate: Date;
  createdAt: Date;
}

export interface PlayerStats {
  id: number;
  playerName: string;
  matchesPlayed: number;
  matchesWon: number;
  setsWon: number;
  gamesWon: number;
  updatedAt: Date;
}

export interface LiveMatchState {
  team1Player1: string;
  team1Player2: string;
  team2Player1: string;
  team2Player2: string;
  team1Sets: number;
  team2Sets: number;
  team1Games: number;
  team2Games: number;
}

export interface TeamStats {
  player1: string;
  player2: string;
  matchesPlayed: number;
  matchesWon: number;
  winPercentage: number;
}
