import { describe, it, expect } from 'vitest';
import { HumanPlayer } from '../../src/players/human-player.js';
import { Player } from '../../src/players/player.js';
import type { GameState } from '../../src/types/game.js';

describe('HumanPlayer', () => {
  describe('constructor', () => {
    it('should create a human player with specified symbol', () => {
      const player = new HumanPlayer('X');

      expect(player.symbol).toBe('X');
      expect(player.name).toBe('Human');
      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(HumanPlayer);
    });

    it('should create a human player with custom name', () => {
      const player = new HumanPlayer('O', 'Alice');

      expect(player.symbol).toBe('O');
      expect(player.name).toBe('Alice');
    });

    it('should support both player symbols', () => {
      const playerX = new HumanPlayer('X');
      const playerO = new HumanPlayer('O');

      expect(playerX.symbol).toBe('X');
      expect(playerO.symbol).toBe('O');
    });

    it('should use default name when not provided', () => {
      const player = new HumanPlayer('X');

      expect(player.name).toBe('Human');
    });

    it('should allow custom names', () => {
      const player1 = new HumanPlayer('X', 'Player 1');
      const player2 = new HumanPlayer('O', 'Player 2');

      expect(player1.name).toBe('Player 1');
      expect(player2.name).toBe('Player 2');
    });
  });

  describe('properties', () => {
    it('should have readonly symbol property', () => {
      const player = new HumanPlayer('X');

      expect(player.symbol).toBe('X');
      // TypeScript enforces readonly: player.symbol = 'O'; // Would cause error
    });

    it('should have readonly name property', () => {
      const player = new HumanPlayer('X', 'Test Player');

      expect(player.name).toBe('Test Player');
      // TypeScript enforces readonly: player.name = 'Other'; // Would cause error
    });
  });

  describe('getMove', () => {
    const createGameState = (): GameState => ({
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
    });

    it('should throw error indicating UI implementation needed', async () => {
      const player = new HumanPlayer('X');
      const gameState = createGameState();

      await expect(player.getMove(gameState)).rejects.toThrow(
        'Human player requires UI implementation'
      );
    });

    it('should throw error for both player symbols', async () => {
      const playerX = new HumanPlayer('X');
      const playerO = new HumanPlayer('O');
      const gameState = createGameState();

      await expect(playerX.getMove(gameState)).rejects.toThrow(
        'Human player requires UI implementation'
      );
      await expect(playerO.getMove(gameState)).rejects.toThrow(
        'Human player requires UI implementation'
      );
    });

    it('should throw error regardless of game state', async () => {
      const player = new HumanPlayer('X');

      // Empty board
      const emptyGameState: GameState = {
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

      // Partial board
      const partialGameState = createGameState();

      // Near-full board
      const nearFullGameState: GameState = {
        board: [
          ['X', 'O', 'X'],
          ['O', 'X', 'O'],
          ['O', null, 'X'],
        ],
        currentPlayer: 'X',
        status: 'playing',
        winner: null,
        moves: [],
        turnNumber: 8,
      };

      await expect(player.getMove(emptyGameState)).rejects.toThrow();
      await expect(player.getMove(partialGameState)).rejects.toThrow();
      await expect(player.getMove(nearFullGameState)).rejects.toThrow();
    });

    it('should return a Promise that rejects', () => {
      const player = new HumanPlayer('X');
      const gameState = createGameState();

      const result = player.getMove(gameState);
      expect(result).toBeInstanceOf(Promise);

      // Verify it's a rejecting promise
      return expect(result).rejects.toThrow();
    });
  });

  describe('inheritance', () => {
    it('should extend the abstract Player class', () => {
      const player = new HumanPlayer('X');

      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(HumanPlayer);
    });

    it('should implement the Player interface correctly', () => {
      const player = new HumanPlayer('X', 'Human Player');

      // Has required properties
      expect(player.symbol).toBeDefined();
      expect(player.name).toBeDefined();
      expect(typeof player.getMove).toBe('function');

      // Properties have correct types
      expect(typeof player.symbol).toBe('string');
      expect(typeof player.name).toBe('string');
    });
  });

  describe('multiple instances', () => {
    it('should support multiple human players with different symbols', () => {
      const player1 = new HumanPlayer('X', 'Alice');
      const player2 = new HumanPlayer('O', 'Bob');

      expect(player1.symbol).toBe('X');
      expect(player1.name).toBe('Alice');
      expect(player2.symbol).toBe('O');
      expect(player2.name).toBe('Bob');

      // Should be separate instances
      expect(player1).not.toBe(player2);
    });

    it('should allow same symbol with different names', () => {
      const player1 = new HumanPlayer('X', 'Alice');
      const player2 = new HumanPlayer('X', 'Charlie');

      expect(player1.symbol).toBe('X');
      expect(player1.name).toBe('Alice');
      expect(player2.symbol).toBe('X');
      expect(player2.name).toBe('Charlie');

      expect(player1).not.toBe(player2);
    });
  });
});
