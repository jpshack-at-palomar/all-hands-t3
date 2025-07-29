import { describe, it, expect, vi } from 'vitest';
import { RandomAIPlayer } from '../../src/players/random-ai-player.js';
import { Player } from '../../src/players/player.js';
import type { GameState, CellValue } from '../../src/types/game.js';

describe('RandomAIPlayer', () => {
  describe('constructor', () => {
    it('should create a random AI player with specified symbol', () => {
      const player = new RandomAIPlayer('X');

      expect(player.symbol).toBe('X');
      expect(player.name).toBe('Random AI');
      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(RandomAIPlayer);
    });

    it('should create a random AI player with custom name', () => {
      const player = new RandomAIPlayer('O', 'Smart Bot');

      expect(player.symbol).toBe('O');
      expect(player.name).toBe('Smart Bot');
    });

    it('should support both player symbols', () => {
      const playerX = new RandomAIPlayer('X');
      const playerO = new RandomAIPlayer('O');

      expect(playerX.symbol).toBe('X');
      expect(playerO.symbol).toBe('O');
    });

    it('should use default name when not provided', () => {
      const player = new RandomAIPlayer('X');

      expect(player.name).toBe('Random AI');
    });
  });

  describe('properties', () => {
    it('should have readonly symbol property', () => {
      const player = new RandomAIPlayer('X');

      expect(player.symbol).toBe('X');
      // TypeScript enforces readonly
    });

    it('should have readonly name property', () => {
      const player = new RandomAIPlayer('X', 'Test AI');

      expect(player.name).toBe('Test AI');
      // TypeScript enforces readonly
    });
  });

  describe('getMove', () => {
    const createGameState = (board: CellValue[][]): GameState => ({
      board,
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should return a valid move from available positions', async () => {
      const player = new RandomAIPlayer('X');
      const gameState = createGameState([
        [null, 'O', null],
        ['X', null, null],
        [null, null, 'O'],
      ]);

      const move = await player.getMove(gameState);

      // Should be a valid position object
      expect(move).toHaveProperty('row');
      expect(move).toHaveProperty('col');
      expect(typeof move.row).toBe('number');
      expect(typeof move.col).toBe('number');

      // Should be within bounds
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThanOrEqual(2);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThanOrEqual(2);

      // Should be an empty position
      expect(gameState.board[move.row][move.col]).toBe(null);
    });

    it('should only select from available positions', async () => {
      const player = new RandomAIPlayer('X');
      const gameState = createGameState([
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', null, 'X'], // Only (2,1) is available
      ]);

      const move = await player.getMove(gameState);

      // Should be the only available position
      expect(move).toEqual({ row: 2, col: 1 });
    });

    it('should work with empty board', async () => {
      const player = new RandomAIPlayer('X');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const move = await player.getMove(gameState);

      // Should be any valid position
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThanOrEqual(2);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThanOrEqual(2);
    });

    it('should throw error when no moves available', async () => {
      const player = new RandomAIPlayer('X');
      const gameState = createGameState([
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', 'X', 'O'], // No empty positions
      ]);

      await expect(player.getMove(gameState)).rejects.toThrow(
        'No available moves'
      );
    });

    it('should return a Promise', () => {
      const player = new RandomAIPlayer('X');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const result = player.getMove(gameState);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should make random selections', async () => {
      // Mock Math.random to control randomness
      const originalRandom = Math.random;

      try {
        const player = new RandomAIPlayer('X');
        const gameState = createGameState([
          [null, null, null],
          [null, null, null],
          [null, null, null],
        ]);

        // Test with different random values
        Math.random = vi.fn().mockReturnValue(0); // First move
        const move1 = await player.getMove(gameState);
        expect(move1).toEqual({ row: 0, col: 0 });

        Math.random = vi.fn().mockReturnValue(0.5); // Middle move
        const move2 = await player.getMove(gameState);
        expect(move2).toEqual({ row: 1, col: 1 });

        Math.random = vi.fn().mockReturnValue(0.99); // Last move
        const move3 = await player.getMove(gameState);
        expect(move3).toEqual({ row: 2, col: 2 });
      } finally {
        Math.random = originalRandom;
      }
    });

    it('should work with different board states', async () => {
      const player = new RandomAIPlayer('O');

      // Test various board configurations
      const boardStates = [
        // Single move available
        [
          ['X', 'O', 'X'],
          ['O', 'X', 'O'],
          ['O', null, 'X'],
        ],
        // Two moves available
        [
          ['X', 'O', 'X'],
          ['O', null, 'O'],
          ['O', null, 'X'],
        ],
        // Multiple moves available
        [
          [null, 'O', null],
          ['X', null, null],
          [null, null, 'O'],
        ],
      ];

      for (const board of boardStates) {
        const gameState = createGameState(board);
        const move = await player.getMove(gameState);

        // Should be a valid empty position
        expect(gameState.board[move.row][move.col]).toBe(null);
      }
    });
  });

  describe('inheritance', () => {
    it('should extend the abstract Player class', () => {
      const player = new RandomAIPlayer('X');

      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(RandomAIPlayer);
    });

    it('should implement the Player interface correctly', () => {
      const player = new RandomAIPlayer('X', 'Random Bot');

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
    const createGameState = (board: CellValue[][]): GameState => ({
      board,
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should support multiple AI players with different symbols', () => {
      const player1 = new RandomAIPlayer('X', 'Bot 1');
      const player2 = new RandomAIPlayer('O', 'Bot 2');

      expect(player1.symbol).toBe('X');
      expect(player1.name).toBe('Bot 1');
      expect(player2.symbol).toBe('O');
      expect(player2.name).toBe('Bot 2');

      // Should be separate instances
      expect(player1).not.toBe(player2);
    });

    it('should make independent random choices', async () => {
      const player1 = new RandomAIPlayer('X');
      const player2 = new RandomAIPlayer('O');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      // Both should be able to make moves independently
      const move1 = await player1.getMove(gameState);
      const move2 = await player2.getMove(gameState);

      // Both moves should be valid
      expect(move1).toHaveProperty('row');
      expect(move1).toHaveProperty('col');
      expect(move2).toHaveProperty('row');
      expect(move2).toHaveProperty('col');
    });
  });

  describe('edge cases', () => {
    const createGameState = (board: CellValue[][]): GameState => ({
      board,
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should handle single available position correctly', async () => {
      const player = new RandomAIPlayer('X');
      const gameState = createGameState([
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', null, 'X'],
      ]);

      // With only one move available, should always return that move
      const move1 = await player.getMove(gameState);
      const move2 = await player.getMove(gameState);
      const move3 = await player.getMove(gameState);

      expect(move1).toEqual({ row: 2, col: 1 });
      expect(move2).toEqual({ row: 2, col: 1 });
      expect(move3).toEqual({ row: 2, col: 1 });
    });

    it('should work regardless of current player in game state', async () => {
      const playerX = new RandomAIPlayer('X');
      const playerO = new RandomAIPlayer('O');

      const gameStateXTurn = createGameState([
        [null, null, null],
        [null, 'X', null],
        [null, null, null],
      ]);
      gameStateXTurn.currentPlayer = 'X';

      const gameStateOTurn = { ...gameStateXTurn, currentPlayer: 'O' as const };

      // Both players should be able to make moves regardless of whose turn it is
      const moveX = await playerX.getMove(gameStateXTurn);
      const moveO = await playerO.getMove(gameStateOTurn);

      expect(moveX).toHaveProperty('row');
      expect(moveX).toHaveProperty('col');
      expect(moveO).toHaveProperty('row');
      expect(moveO).toHaveProperty('col');
    });
  });
});
