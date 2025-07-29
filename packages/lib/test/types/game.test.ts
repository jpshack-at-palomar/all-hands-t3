import { describe, it, expect } from 'vitest';
import type {
  Player,
  CellValue,
  GameStatus,
  Position,
  GridPosition,
  GameMove,
  GameState,
  MoveAnalysis,
} from '../../src/types/game.js';

describe('Game Types', () => {
  describe('Player type', () => {
    it('should accept valid player values', () => {
      const playerX: Player = 'X';
      const playerO: Player = 'O';

      expect(playerX).toBe('X');
      expect(playerO).toBe('O');
    });
  });

  describe('CellValue type', () => {
    it('should accept player values and null', () => {
      const cellX: CellValue = 'X';
      const cellO: CellValue = 'O';
      const cellEmpty: CellValue = null;

      expect(cellX).toBe('X');
      expect(cellO).toBe('O');
      expect(cellEmpty).toBe(null);
    });
  });

  describe('GameStatus type', () => {
    it('should accept valid game status values', () => {
      const playing: GameStatus = 'playing';
      const won: GameStatus = 'won';
      const draw: GameStatus = 'draw';

      expect(playing).toBe('playing');
      expect(won).toBe('won');
      expect(draw).toBe('draw');
    });
  });

  describe('Position interface', () => {
    it('should create valid position objects', () => {
      const position: Position = { row: 1, col: 2 };

      expect(position.row).toBe(1);
      expect(position.col).toBe(2);
    });

    it('should accept boundary values', () => {
      const topLeft: Position = { row: 0, col: 0 };
      const bottomRight: Position = { row: 2, col: 2 };

      expect(topLeft).toEqual({ row: 0, col: 0 });
      expect(bottomRight).toEqual({ row: 2, col: 2 });
    });
  });

  describe('GridPosition interface', () => {
    it('should create valid grid position objects', () => {
      const gridPos: GridPosition = { letter: 'A', number: 1 };

      expect(gridPos.letter).toBe('A');
      expect(gridPos.number).toBe(1);
    });

    it('should accept all valid grid positions', () => {
      const a1: GridPosition = { letter: 'A', number: 1 };
      const b2: GridPosition = { letter: 'B', number: 2 };
      const c3: GridPosition = { letter: 'C', number: 3 };

      expect(a1).toEqual({ letter: 'A', number: 1 });
      expect(b2).toEqual({ letter: 'B', number: 2 });
      expect(c3).toEqual({ letter: 'C', number: 3 });
    });
  });

  describe('GameMove interface', () => {
    it('should create valid game move objects', () => {
      const move: GameMove = {
        player: 'X',
        position: { row: 1, col: 1 },
        gridPosition: { letter: 'B', number: 2 },
        timestamp: Date.now(),
      };

      expect(move.player).toBe('X');
      expect(move.position).toEqual({ row: 1, col: 1 });
      expect(move.gridPosition).toEqual({ letter: 'B', number: 2 });
      expect(typeof move.timestamp).toBe('number');
    });
  });

  describe('GameState interface', () => {
    it('should create valid game state objects', () => {
      const gameState: GameState = {
        board: [
          [null, null, null],
          [null, 'X', null],
          [null, null, null],
        ],
        currentPlayer: 'O',
        status: 'playing',
        winner: null,
        moves: [],
        turnNumber: 1,
      };

      expect(gameState.board).toHaveLength(3);
      expect(gameState.board[0]).toHaveLength(3);
      expect(gameState.currentPlayer).toBe('O');
      expect(gameState.status).toBe('playing');
      expect(gameState.winner).toBe(null);
      expect(gameState.moves).toEqual([]);
      expect(gameState.turnNumber).toBe(1);
    });

    it('should handle won game state', () => {
      const wonState: GameState = {
        board: [
          ['X', 'X', 'X'],
          [null, 'O', null],
          [null, 'O', null],
        ],
        currentPlayer: 'X',
        status: 'won',
        winner: 'X',
        moves: [],
        turnNumber: 5,
      };

      expect(wonState.status).toBe('won');
      expect(wonState.winner).toBe('X');
    });
  });

  describe('MoveAnalysis interface', () => {
    it('should create valid move analysis objects', () => {
      const analysis: MoveAnalysis = {
        position: { row: 0, col: 0 },
        gridPosition: { letter: 'A', number: 1 },
        winInTurns: 1,
        blocksOpponentWin: false,
        createsFork: false,
        blocksOpponentFork: false,
      };

      expect(analysis.position).toEqual({ row: 0, col: 0 });
      expect(analysis.gridPosition).toEqual({ letter: 'A', number: 1 });
      expect(analysis.winInTurns).toBe(1);
      expect(analysis.blocksOpponentWin).toBe(false);
      expect(analysis.createsFork).toBe(false);
      expect(analysis.blocksOpponentFork).toBe(false);
    });

    it('should handle null winInTurns', () => {
      const analysis: MoveAnalysis = {
        position: { row: 1, col: 1 },
        gridPosition: { letter: 'B', number: 2 },
        winInTurns: null,
        blocksOpponentWin: true,
        createsFork: false,
        blocksOpponentFork: true,
      };

      expect(analysis.winInTurns).toBe(null);
      expect(analysis.blocksOpponentWin).toBe(true);
      expect(analysis.blocksOpponentFork).toBe(true);
    });
  });
});
