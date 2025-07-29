import { describe, it, expect, beforeEach } from 'vitest';
import { MoveAnalyzer } from '../../src/game/move-analyzer.js';
import type { GameState, Position, CellValue } from '../../src/types/game.js';

describe('MoveAnalyzer', () => {
  let analyzer: MoveAnalyzer;

  beforeEach(() => {
    analyzer = new MoveAnalyzer();
  });

  const createGameState = (
    board: CellValue[][],
    currentPlayer: 'X' | 'O' = 'X'
  ): GameState => {
    return {
      board,
      currentPlayer,
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    };
  };

  describe('checkWinner', () => {
    it('should detect horizontal wins', () => {
      const boards = [
        // Top row
        [
          ['X', 'X', 'X'],
          [null, 'O', null],
          [null, 'O', null],
        ],
        // Middle row
        [
          [null, 'O', null],
          ['X', 'X', 'X'],
          [null, 'O', null],
        ],
        // Bottom row
        [
          [null, 'O', null],
          [null, 'O', null],
          ['X', 'X', 'X'],
        ],
      ];

      boards.forEach((board) => {
        expect(analyzer.checkWinner(board as CellValue[][])).toBe('X');
      });
    });

    it('should detect vertical wins', () => {
      const boards = [
        // Left column
        [
          ['X', null, 'O'],
          ['X', null, 'O'],
          ['X', null, null],
        ],
        // Middle column
        [
          [null, 'X', 'O'],
          [null, 'X', 'O'],
          [null, 'X', null],
        ],
        // Right column
        [
          ['O', null, 'X'],
          ['O', null, 'X'],
          [null, null, 'X'],
        ],
      ];

      boards.forEach((board) => {
        expect(analyzer.checkWinner(board as CellValue[][])).toBe('X');
      });
    });

    it('should detect diagonal wins', () => {
      const mainDiagonal = [
        ['X', null, 'O'],
        [null, 'X', 'O'],
        [null, null, 'X'],
      ];

      const antiDiagonal = [
        ['O', null, 'X'],
        [null, 'X', null],
        ['X', null, 'O'],
      ];

      expect(analyzer.checkWinner(mainDiagonal as CellValue[][])).toBe('X');
      expect(analyzer.checkWinner(antiDiagonal as CellValue[][])).toBe('X');
    });

    it('should return null for no winner', () => {
      const boards = [
        // Empty board
        [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        // Partial game
        [
          ['X', 'O', null],
          [null, 'X', null],
          [null, null, 'O'],
        ],
        // Draw game
        [
          ['X', 'O', 'X'],
          ['O', 'O', 'X'],
          ['O', 'X', 'O'],
        ],
      ];

      boards.forEach((board) => {
        expect(analyzer.checkWinner(board as CellValue[][])).toBe(null);
      });
    });
  });

  describe('analyzeMoves', () => {
    it('should find all available moves on empty board', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const analysis = analyzer.analyzeMoves(gameState);
      expect(analysis).toHaveLength(9);

      // Check that all positions are included
      const positions = analysis.map((a) => a.position);
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(positions).toContainEqual({ row, col });
        }
      }
    });

    it('should find only empty positions', () => {
      const gameState = createGameState([
        ['X', null, 'O'],
        [null, 'X', null],
        ['O', null, null],
      ]);

      const analysis = analyzer.analyzeMoves(gameState);
      expect(analysis).toHaveLength(5);

      const positions = analysis.map((a) => a.position);
      expect(positions).toContainEqual({ row: 0, col: 1 });
      expect(positions).toContainEqual({ row: 1, col: 0 });
      expect(positions).toContainEqual({ row: 1, col: 2 });
      expect(positions).toContainEqual({ row: 2, col: 1 });
      expect(positions).toContainEqual({ row: 2, col: 2 });
    });

    it('should return empty array for full board', () => {
      const gameState = createGameState([
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O'],
      ]);

      const analysis = analyzer.analyzeMoves(gameState);
      expect(analysis).toHaveLength(0);
    });

    it('should include grid positions in analysis', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const analysis = analyzer.analyzeMoves(gameState);

      // Check that grid positions are correctly calculated
      const a1Move = analysis.find(
        (a) => a.position.row === 0 && a.position.col === 0
      );
      expect(a1Move?.gridPosition).toEqual({ letter: 'A', number: 1 });

      const c3Move = analysis.find(
        (a) => a.position.row === 2 && a.position.col === 2
      );
      expect(c3Move?.gridPosition).toEqual({ letter: 'C', number: 3 });
    });
  });

  describe('analyzeMove', () => {
    it('should detect winning moves', () => {
      const gameState = createGameState(
        [
          ['X', 'X', null], // X can win by playing (0,2)
          ['O', null, null],
          ['O', null, null],
        ],
        'X'
      );

      const winningPosition: Position = { row: 0, col: 2 };
      const analysis = analyzer.analyzeMove(gameState, winningPosition);

      expect(analysis.winInTurns).toBe(1);
      expect(analysis.position).toEqual(winningPosition);
      expect(analysis.gridPosition).toEqual({ letter: 'C', number: 1 });
    });

    it('should detect blocking moves', () => {
      const gameState = createGameState(
        [
          ['O', 'O', null], // X should block O's win at (0,2)
          ['X', null, null],
          [null, null, null],
        ],
        'X'
      );

      const blockingPosition: Position = { row: 0, col: 2 };
      const analysis = analyzer.analyzeMove(gameState, blockingPosition);

      expect(analysis.blocksOpponentWin).toBe(true);
    });

    it('should handle neutral moves', () => {
      const gameState = createGameState(
        [
          [null, null, null],
          [null, 'X', null],
          [null, null, null],
        ],
        'O'
      );

      const neutralPosition: Position = { row: 0, col: 0 };
      const analysis = analyzer.analyzeMove(gameState, neutralPosition);

      expect(analysis.winInTurns).toBe(null);
      expect(analysis.blocksOpponentWin).toBe(false);
      expect(analysis.createsFork).toBe(false);
      expect(analysis.blocksOpponentFork).toBe(false);
    });

    it('should analyze multiple scenarios correctly', () => {
      const gameState = createGameState(
        [
          ['X', null, 'O'],
          [null, 'X', null],
          ['O', null, null],
        ],
        'X'
      );

      // Test winning move at (2, 2)
      const winMove = analyzer.analyzeMove(gameState, { row: 2, col: 2 });
      expect(winMove.winInTurns).toBe(1);

      // Test non-winning move at (0, 1)
      const neutralMove = analyzer.analyzeMove(gameState, { row: 0, col: 1 });
      expect(neutralMove.winInTurns).toBe(null);
    });
  });

  describe('integration with actual game scenarios', () => {
    it('should analyze a complex mid-game position', () => {
      // X: (1,1), O: (0,0), (2,2)
      const gameState = createGameState(
        [
          ['O', null, null],
          [null, 'X', null],
          [null, null, 'O'],
        ],
        'X'
      );

      const analysis = analyzer.analyzeMoves(gameState);
      expect(analysis).toHaveLength(6); // 6 empty positions

      // All moves should be analyzed without errors
      analysis.forEach((move) => {
        expect(move.position).toBeDefined();
        expect(move.gridPosition).toBeDefined();
        expect(
          typeof move.winInTurns === 'number' || move.winInTurns === null
        ).toBe(true);
        expect(typeof move.blocksOpponentWin).toBe('boolean');
        expect(typeof move.createsFork).toBe('boolean');
        expect(typeof move.blocksOpponentFork).toBe('boolean');
      });
    });

    it('should detect immediate threats and opportunities', () => {
      // O has two in a row, X needs to block
      const gameState = createGameState(
        [
          ['O', 'O', null],
          ['X', null, null],
          [null, null, null],
        ],
        'X'
      );

      const analysis = analyzer.analyzeMoves(gameState);
      const blockingMove = analysis.find((move) => move.blocksOpponentWin);

      expect(blockingMove).toBeDefined();
      expect(blockingMove?.position).toEqual({ row: 0, col: 2 });
    });
  });
});
