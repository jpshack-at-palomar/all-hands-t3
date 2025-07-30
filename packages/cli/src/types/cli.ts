// CLI-specific type definitions for tic-tac-toe CLI

export interface GameOptions {
  aiType: 'random' | 'strategic';
  humanFirst: boolean;
}

export interface MatchOptions {
  games: number;
  aiType: 'random' | 'strategic';
}

export interface MoveInput {
  gridPosition: string; // e.g., "A1", "B2"
  position: { row: number; col: number };
}

export interface GameResult {
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  moves: Array<{
    player: 'X' | 'O';
    position: string; // grid position like "A1"
    turn: number;
  }>;
}

export interface MatchResult {
  games: GameResult[];
  humanWins: number;
  aiWins: number;
  draws: number;
  winner: 'human' | 'ai' | 'tie';
}

// Grid coordinate system types
export type GridColumn = 'A' | 'B' | 'C';
export type GridRow = 1 | 2 | 3;
export type GridPosition = `${GridColumn}${GridRow}`;

// CLI command types
export interface CommandResult {
  success: boolean;
  message?: string;
  data?: unknown;
}

// Prompt types
export interface PromptOptions {
  message: string;
  choices?: string[];
  validate?: (input: string) => boolean | string;
}

export interface PromptResult {
  value: string;
  cancelled: boolean;
}

// AI player types
export type AIPlayerType = 'random' | 'strategic';

// Game flow types
export interface TurnInfo {
  player: 'X' | 'O';
  position: GridPosition;
  turn: number;
  isHuman: boolean;
}
