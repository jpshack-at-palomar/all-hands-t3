import { describe, it, expect } from 'vitest';
import { Player } from '../../src/players/player.js';
import type {
  Player as PlayerType,
  Position,
  GameState,
} from '../../src/types/game.js';

// Concrete implementation for testing
class TestPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;

  constructor(symbol: PlayerType, name: string = 'Test Player') {
    super();
    this.symbol = symbol;
    this.name = name;
  }

  async getMove(gameState: GameState): Promise<Position> {
    void gameState; // Avoid unused parameter warning
    return { row: 0, col: 0 };
  }
}

describe('Player', () => {
  describe('abstract class', () => {
    it('should be extensible by concrete implementations', () => {
      const player = new TestPlayer('X', 'Test Player');

      expect(player.symbol).toBe('X');
      expect(player.name).toBe('Test Player');
      expect(player).toBeInstanceOf(Player);
    });

    it('should have required abstract properties', () => {
      const player = new TestPlayer('O');

      expect(player.symbol).toBeDefined();
      expect(player.name).toBeDefined();
      expect(typeof player.getMove).toBe('function');
    });

    it('should support both player symbols', () => {
      const playerX = new TestPlayer('X');
      const playerO = new TestPlayer('O');

      expect(playerX.symbol).toBe('X');
      expect(playerO.symbol).toBe('O');
    });

    it('should support custom names', () => {
      const player1 = new TestPlayer('X', 'Alice');
      const player2 = new TestPlayer('O', 'Bob');

      expect(player1.name).toBe('Alice');
      expect(player2.name).toBe('Bob');
    });

    it('should handle getMove method', async () => {
      const player = new TestPlayer('X');
      const gameState: GameState = {
        board: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        currentPlayer: 'X',
        status: 'playing',
        winner: null,
        moves: [],
        turnNumber: 0,
      };

      const move = await player.getMove(gameState);
      expect(move).toEqual({ row: 0, col: 0 });
    });

    it('should have optional analyzeMove method', () => {
      const player = new TestPlayer('X');

      // analyzeMove is optional, so it may or may not exist
      expect(
        typeof player.analyzeMove === 'function' ||
          player.analyzeMove === undefined
      ).toBe(true);
    });
  });

  describe('interface contract', () => {
    it('should ensure symbol is readonly', () => {
      const player = new TestPlayer('X');

      // TypeScript enforces readonly, but we can verify the property exists
      expect(player.symbol).toBe('X');

      // This would cause a TypeScript error: player.symbol = 'O';
    });

    it('should ensure name is readonly', () => {
      const player = new TestPlayer('X', 'Test');

      // TypeScript enforces readonly, but we can verify the property exists
      expect(player.name).toBe('Test');

      // This would cause a TypeScript error: player.name = 'Other';
    });

    it('should return a Promise from getMove', async () => {
      const player = new TestPlayer('X');
      const gameState: GameState = {
        board: [
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ],
        currentPlayer: 'X',
        status: 'playing',
        winner: null,
        moves: [],
        turnNumber: 0,
      };

      const result = player.getMove(gameState);
      expect(result).toBeInstanceOf(Promise);

      const move = await result;
      expect(move).toHaveProperty('row');
      expect(move).toHaveProperty('col');
    });
  });
});
