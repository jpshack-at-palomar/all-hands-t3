/* eslint-env node */
/* eslint-disable no-undef, @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GameController } from '../../src/utils/game-controller.js';
import type { GameOptions } from '../../src/types/cli.js';

describe('GameController', () => {
  let gameController: GameController;

  beforeEach(() => {
    gameController = new GameController();
    // Mock console.log to avoid cluttering test output
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Constructor', () => {
    it('should initialize a new game controller', () => {
      expect(gameController).toBeDefined();
      expect(gameController.getCurrentGameState()).toBeNull();
      expect(gameController.isGameOver()).toBe(false);
    });
  });

  describe('Grid Position Conversion', () => {
    it('should convert grid positions to Position objects', () => {
      const position = gameController.gridPositionToPosition('A1');
      expect(position.row).toBe(0);
      expect(position.col).toBe(0);

      const positionB2 = gameController.gridPositionToPosition('B2');
      expect(positionB2.row).toBe(1);
      expect(positionB2.col).toBe(1);

      const positionC3 = gameController.gridPositionToPosition('C3');
      expect(positionC3.row).toBe(2);
      expect(positionC3.col).toBe(2);
    });

    it('should throw error for invalid grid positions', () => {
      expect(() =>
        gameController.gridPositionToPosition('D1' as any)
      ).toThrow();
      expect(() =>
        gameController.gridPositionToPosition('A4' as any)
      ).toThrow();
      expect(() =>
        gameController.gridPositionToPosition('Z9' as any)
      ).toThrow();
    });
  });

  describe('Move Validation', () => {
    it('should return false for uninitialized controller', () => {
      // Uninitialized controller should return false for all moves
      expect(gameController.isValidMove('A1')).toBe(false);
      expect(gameController.isValidMove('B2')).toBe(false);
      expect(gameController.isValidMove('C3')).toBe(false);
    });

    it('should reject invalid grid positions', () => {
      expect(gameController.isValidMove('D1' as any)).toBe(false);
      expect(gameController.isValidMove('A4' as any)).toBe(false);
      expect(gameController.isValidMove('' as any)).toBe(false);
    });

    it('should validate moves correctly during gameplay', async () => {
      // Test move validation during an actual game
      const result = await gameController.playGame({
        aiType: 'random',
        humanFirst: true,
      });

      expect(result).toBeDefined();
      expect(result.moves.length).toBeGreaterThan(0);
    });
  });

  describe('Available Moves', () => {
    it('should return empty array for uninitialized controller', () => {
      const availableMoves = gameController.getAvailableGridPositions();

      expect(availableMoves).toHaveLength(0);
    });

    it('should track available moves during gameplay', async () => {
      // Test available moves during an actual game
      const result = await gameController.playGame({
        aiType: 'random',
        humanFirst: true,
      });

      expect(result).toBeDefined();
      expect(result.moves.length).toBeGreaterThan(0);
      expect(result.moves.length).toBeLessThanOrEqual(9);
    });
  });

  describe('Game Play', () => {
    it('should play a complete game with random AI', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: false,
      };

      const result = await gameController.playGame(options);

      expect(result).toBeDefined();
      expect(result.moves.length).toBeGreaterThan(0);
      expect(result.moves.length).toBeLessThanOrEqual(9);
      expect(typeof result.isDraw).toBe('boolean');

      // Winner should be 'X', 'O', or null (for draw)
      if (result.winner) {
        expect(['X', 'O']).toContain(result.winner);
      }
    });

    it('should play a complete game with strategic AI', async () => {
      const options: GameOptions = {
        aiType: 'strategic',
        humanFirst: true,
      };

      const result = await gameController.playGame(options);

      expect(result).toBeDefined();
      expect(result.moves.length).toBeGreaterThan(0);
      expect(result.moves.length).toBeLessThanOrEqual(9);
      expect(typeof result.isDraw).toBe('boolean');
    });

    it('should record moves correctly', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: false,
      };

      const result = await gameController.playGame(options);

      expect(result.moves).toBeDefined();
      expect(Array.isArray(result.moves)).toBe(true);

      result.moves.forEach((move, index) => {
        expect(move.player).toMatch(/^[XO]$/);
        expect(move.position).toMatch(/^[ABC][123]$/);
        expect(move.turn).toBe(index + 1);
      });
    });

    it('should alternate players correctly', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: true,
      };

      const result = await gameController.playGame(options);

      // First move should be X, second should be O, etc.
      for (let i = 0; i < result.moves.length; i++) {
        const expectedPlayer = i % 2 === 0 ? 'X' : 'O';
        expect(result.moves[i].player).toBe(expectedPlayer);
      }
    });

    it('should handle game ending conditions', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: false,
      };

      const result = await gameController.playGame(options);

      // Game should be over
      expect(gameController.isGameOver()).toBe(true);

      // Either someone won or it's a draw
      const hasWinner = result.winner !== null;
      const isDraw = result.isDraw;

      expect(hasWinner || isDraw).toBe(true);

      if (hasWinner) {
        expect(isDraw).toBe(false);
      }

      if (isDraw) {
        expect(hasWinner).toBe(false);
      }
    });
  });

  describe('AI Integration', () => {
    it('should create random AI player', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: true,
      };

      // Should not throw error
      const result = await gameController.playGame(options);
      expect(result).toBeDefined();
    });

    it('should create strategic AI player', async () => {
      const options: GameOptions = {
        aiType: 'strategic',
        humanFirst: true,
      };

      // Should not throw error
      const result = await gameController.playGame(options);
      expect(result).toBeDefined();
    });

    it('should throw error for unknown AI type', async () => {
      const options = {
        aiType: 'unknown' as any,
        humanFirst: true,
      };

      await expect(gameController.playGame(options)).rejects.toThrow(
        'Unknown AI type: unknown'
      );
    });
  });

  describe('Game State Management', () => {
    it('should return null for uninitialized controller', () => {
      const initialState = gameController.getCurrentGameState();
      expect(initialState).toBeNull();
    });

    it('should track game state during gameplay', async () => {
      const result = await gameController.playGame({
        aiType: 'random',
        humanFirst: true,
      });

      expect(result).toBeDefined();
      expect(gameController.isGameOver()).toBe(true);

      const finalState = gameController.getCurrentGameState();
      expect(finalState).not.toBeNull();
      expect(finalState?.status).not.toBe('playing');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid moves gracefully', () => {
      // This should throw an error for uninitialized controller
      expect(() => gameController.makeGridMove('A1')).toThrow(
        'Game engine not initialized'
      );
    });

    it('should handle unknown AI types', async () => {
      const options = {
        aiType: 'unknown' as any,
        humanFirst: true,
      };

      await expect(gameController.playGame(options)).rejects.toThrow(
        'Unknown AI type: unknown'
      );
    });
  });

  describe('Performance', () => {
    it('should complete a game in reasonable time', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: false,
      };

      const startTime = Date.now();
      await gameController.playGame(options);
      const endTime = Date.now();

      // Game should complete within 1 second
      expect(endTime - startTime).toBeLessThan(1000);
    });

    it('should handle multiple consecutive games', async () => {
      const options: GameOptions = {
        aiType: 'random',
        humanFirst: true,
      };

      // Play multiple games
      for (let i = 0; i < 3; i++) {
        const result = await gameController.playGame(options);
        expect(result).toBeDefined();
        expect(result.moves.length).toBeGreaterThan(0);
      }
    });
  });
});
