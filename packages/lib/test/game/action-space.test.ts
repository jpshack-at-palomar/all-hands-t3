import { describe, it, expect, beforeEach } from 'vitest';
import { ActionSpaceAnalyzer } from '../../src/game/action-space.js';
import type { GameState, CellValue } from '../../src/types/game.js';

describe('ActionSpaceAnalyzer', () => {
  let analyzer: ActionSpaceAnalyzer;

  beforeEach(() => {
    analyzer = new ActionSpaceAnalyzer();
  });

  // Helper function to create game state
  const createGameState = (
    board: CellValue[][],
    currentPlayer: 'X' | 'O' = 'X',
    turnNumber: number = 0
  ): GameState => ({
    board,
    currentPlayer,
    status: 'playing',
    winner: null,
    moves: [],
    turnNumber,
  });

  describe('constructor', () => {
    it('should create an ActionSpaceAnalyzer instance', () => {
      expect(analyzer).toBeInstanceOf(ActionSpaceAnalyzer);
    });
  });

  describe('getAvailableMoves', () => {
    it('should return all 9 positions for empty board', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const moves = analyzer.getAvailableMoves(gameState);
      expect(moves).toHaveLength(9);

      // Check all positions are included
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(moves).toContainEqual({ row, col });
        }
      }
    });

    it('should exclude occupied positions', () => {
      const gameState = createGameState([
        ['X', null, null],
        [null, 'O', null],
        [null, null, 'X'],
      ]);

      const moves = analyzer.getAvailableMoves(gameState);
      expect(moves).toHaveLength(6);
      expect(moves).not.toContainEqual({ row: 0, col: 0 });
      expect(moves).not.toContainEqual({ row: 1, col: 1 });
      expect(moves).not.toContainEqual({ row: 2, col: 2 });
    });

    it('should return empty array for full board', () => {
      const gameState = createGameState([
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['X', 'O', 'X'],
      ]);

      const moves = analyzer.getAvailableMoves(gameState);
      expect(moves).toHaveLength(0);
    });
  });

  describe('getActionSpaceWithGrid', () => {
    it('should return moves with grid coordinates', () => {
      const gameState = createGameState([
        [null, 'X', null],
        [null, null, null],
        ['O', null, null],
      ]);

      const movesWithGrid = analyzer.getActionSpaceWithGrid(gameState);
      expect(movesWithGrid).toHaveLength(7);

      // Check that each move has grid coordinates
      movesWithGrid.forEach((move) => {
        expect(move).toHaveProperty('row');
        expect(move).toHaveProperty('col');
        expect(move).toHaveProperty('gridPosition');
        expect(move.gridPosition).toHaveProperty('letter');
        expect(move.gridPosition).toHaveProperty('number');
      });

      // Check specific grid coordinate mapping
      const topLeft = movesWithGrid.find((m) => m.row === 0 && m.col === 0);
      expect(topLeft?.gridPosition).toEqual({ letter: 'A', number: 1 });

      const center = movesWithGrid.find((m) => m.row === 1 && m.col === 1);
      expect(center?.gridPosition).toEqual({ letter: 'B', number: 2 });

      const bottomRight = movesWithGrid.find((m) => m.row === 2 && m.col === 2);
      expect(bottomRight?.gridPosition).toEqual({ letter: 'C', number: 3 });
    });

    it('should handle empty board correctly', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const movesWithGrid = analyzer.getActionSpaceWithGrid(gameState);
      expect(movesWithGrid).toHaveLength(9);

      // Verify all grid positions are correct
      const expectedGrids = [
        { row: 0, col: 0, letter: 'A', number: 1 },
        { row: 0, col: 1, letter: 'B', number: 1 },
        { row: 0, col: 2, letter: 'C', number: 1 },
        { row: 1, col: 0, letter: 'A', number: 2 },
        { row: 1, col: 1, letter: 'B', number: 2 },
        { row: 1, col: 2, letter: 'C', number: 2 },
        { row: 2, col: 0, letter: 'A', number: 3 },
        { row: 2, col: 1, letter: 'B', number: 3 },
        { row: 2, col: 2, letter: 'C', number: 3 },
      ];

      expectedGrids.forEach((expected) => {
        const move = movesWithGrid.find(
          (m) => m.row === expected.row && m.col === expected.col
        );
        expect(move?.gridPosition).toEqual({
          letter: expected.letter,
          number: expected.number,
        });
      });
    });
  });

  describe('getStrategicActionSpace', () => {
    it('should filter winning moves', () => {
      const gameState = createGameState([
        ['X', 'X', null], // X can win at (0,2)
        ['O', null, null],
        [null, null, null],
      ]);

      const winningMoves = analyzer.getStrategicActionSpace(
        gameState,
        'winning'
      );
      expect(winningMoves).toContainEqual({ row: 0, col: 2 });
    });

    it('should filter blocking moves', () => {
      const gameState = createGameState([
        ['O', 'O', null], // Need to block at (0,2)
        ['X', null, null],
        [null, null, null],
      ]);

      const blockingMoves = analyzer.getStrategicActionSpace(
        gameState,
        'blocking'
      );
      expect(blockingMoves).toContainEqual({ row: 0, col: 2 });
    });

    it('should return all strategic moves for "all" criteria', () => {
      const gameState = createGameState([
        ['X', 'X', null], // X can win at (0,2)
        ['O', 'O', null], // Need to block O at (1,2)
        [null, null, null],
      ]);

      const allStrategicMoves = analyzer.getStrategicActionSpace(
        gameState,
        'all'
      );
      expect(allStrategicMoves.length).toBeGreaterThan(0);
      expect(allStrategicMoves).toContainEqual({ row: 0, col: 2 });
    });

    it('should return empty array for invalid criteria', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      // @ts-expect-error - Testing invalid criteria
      const moves = analyzer.getStrategicActionSpace(gameState, 'invalid');
      expect(moves).toEqual([]);
    });
  });

  describe('getActionSpace', () => {
    it('should return complete action space for new game', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const actionSpace = analyzer.getActionSpace(gameState);

      expect(actionSpace).toHaveProperty('availableMoves');
      expect(actionSpace).toHaveProperty('totalMoves');
      expect(actionSpace).toHaveProperty('strategicMoves');
      expect(actionSpace).toHaveProperty('bestMove');
      expect(actionSpace).toHaveProperty('gamePhase');

      expect(actionSpace.availableMoves).toHaveLength(9);
      expect(actionSpace.totalMoves).toBe(9);
      expect(actionSpace.strategicMoves).toHaveLength(9);
      expect(actionSpace.gamePhase).toBe('opening');
    });

    it('should identify winning move as best move', () => {
      const gameState = createGameState([
        ['X', 'X', null], // X can win at (0,2)
        ['O', null, null],
        [null, null, null],
      ]);

      const actionSpace = analyzer.getActionSpace(gameState);
      expect(actionSpace.bestMove).toEqual({ row: 0, col: 2 });
    });

    it('should prioritize blocking when no winning move', () => {
      const gameState = createGameState([
        ['O', 'O', null], // Need to block at (0,2)
        ['X', null, null],
        [null, null, null],
      ]);

      const actionSpace = analyzer.getActionSpace(gameState);
      expect(actionSpace.bestMove).toEqual({ row: 0, col: 2 });
    });

    it('should detect correct game phase', () => {
      // Opening game (turn 0-2)
      let gameState = createGameState(
        [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        'X',
        0
      );
      expect(analyzer.getActionSpace(gameState).gamePhase).toBe('opening');

      // Midgame (turn 3-6)
      gameState = createGameState(
        [
          ['X', 'O', null],
          [null, 'X', null],
          [null, null, null],
        ],
        'O',
        4
      );
      expect(analyzer.getActionSpace(gameState).gamePhase).toBe('midgame');

      // Endgame (turn 7+)
      gameState = createGameState(
        [
          ['X', 'O', 'X'],
          ['O', 'X', null],
          [null, null, null],
        ],
        'O',
        7
      );
      expect(analyzer.getActionSpace(gameState).gamePhase).toBe('endgame');
    });
  });

  describe('getActionSpaceStats', () => {
    it('should return correct statistics for empty board', () => {
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const stats = analyzer.getActionSpaceStats(gameState);
      expect(stats.totalMoves).toBe(9);
      expect(stats.winningMoves).toBe(0);
      expect(stats.blockingMoves).toBe(0);
      expect(stats.forkingMoves).toBe(0);
      expect(stats.neutralMoves).toBe(9);
    });

    it('should count winning moves correctly', () => {
      const gameState = createGameState([
        ['X', 'X', null], // X can win at (0,2)
        ['O', null, null],
        [null, null, null],
      ]);

      const stats = analyzer.getActionSpaceStats(gameState);
      expect(stats.winningMoves).toBeGreaterThan(0);
      expect(stats.totalMoves).toBe(6); // 3 positions occupied, 6 remaining
    });

    it('should count blocking moves correctly', () => {
      const gameState = createGameState([
        ['O', 'O', null], // Need to block at (0,2)
        ['X', null, null],
        [null, null, null],
      ]);

      const stats = analyzer.getActionSpaceStats(gameState);
      expect(stats.blockingMoves).toBeGreaterThan(0);
      expect(stats.totalMoves).toBe(6); // 3 positions occupied, 6 remaining
    });

    it('should sum up to total moves', () => {
      const gameState = createGameState([
        ['X', 'O', null],
        [null, 'X', null],
        [null, null, null],
      ]);

      const stats = analyzer.getActionSpaceStats(gameState);
      const sum =
        stats.winningMoves +
        stats.blockingMoves +
        stats.forkingMoves +
        stats.neutralMoves;

      // Note: moves can have multiple properties, so sum might be > totalMoves
      expect(sum).toBeGreaterThanOrEqual(stats.totalMoves);
    });
  });

  describe('edge cases', () => {
    it('should handle board with only one empty space', () => {
      const gameState = createGameState(
        [
          ['X', 'O', 'X'],
          ['O', 'X', 'O'],
          ['X', 'O', null],
        ],
        'X',
        8 // Turn 8 should be endgame
      );

      const actionSpace = analyzer.getActionSpace(gameState);
      expect(actionSpace.totalMoves).toBe(1);
      expect(actionSpace.availableMoves).toEqual([{ row: 2, col: 2 }]);
      expect(actionSpace.gamePhase).toBe('endgame');
    });

    it('should handle complex strategic scenario', () => {
      const gameState = createGameState([
        ['X', null, 'O'],
        [null, 'X', null],
        ['O', null, null],
      ]);

      const actionSpace = analyzer.getActionSpace(gameState);
      expect(actionSpace.totalMoves).toBe(5);
      expect(actionSpace.bestMove).toBeDefined();

      const stats = analyzer.getActionSpaceStats(gameState);
      expect(stats.totalMoves).toBe(5);
    });

    it('should handle winning scenario correctly', () => {
      const gameState = createGameState([
        ['X', 'X', null], // X about to win
        ['O', 'O', 'X'], // O blocked
        ['O', 'X', 'O'],
      ]);

      const actionSpace = analyzer.getActionSpace(gameState);
      expect(actionSpace.totalMoves).toBe(1);
      expect(actionSpace.bestMove).toEqual({ row: 0, col: 2 });

      const stats = analyzer.getActionSpaceStats(gameState);
      expect(stats.winningMoves).toBe(1);
    });
  });

  describe('integration with GameState methods', () => {
    it('should work with GameState integration', () => {
      // This test verifies the interface compatibility
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      // These should not throw errors
      const actionSpace = analyzer.getActionSpace(gameState);
      const moves = analyzer.getAvailableMoves(gameState);
      const gridMoves = analyzer.getActionSpaceWithGrid(gameState);
      const strategicMoves = analyzer.getStrategicActionSpace(gameState, 'all');
      const stats = analyzer.getActionSpaceStats(gameState);

      expect(actionSpace).toBeDefined();
      expect(moves).toBeDefined();
      expect(gridMoves).toBeDefined();
      expect(strategicMoves).toBeDefined();
      expect(stats).toBeDefined();
    });
  });
});
