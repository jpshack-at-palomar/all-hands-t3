export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';

export interface Position {
  row: number; // 0-2
  col: number; // 0-2
}

export interface GridPosition {
  letter: string; // 'A', 'B', 'C'
  number: number; // 1, 2, 3
}

export interface GameMove {
  player: Player;
  position: Position;
  gridPosition: GridPosition;
  timestamp: number;
}

export interface GameState {
  board: CellValue[][];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  moves: GameMove[];
  turnNumber: number;
}

export interface MoveAnalysis {
  position: Position;
  gridPosition: GridPosition;
  winInTurns: number | null; // null if no win possible
  blocksOpponentWin: boolean;
  createsFork: boolean;
  blocksOpponentFork: boolean;
}
