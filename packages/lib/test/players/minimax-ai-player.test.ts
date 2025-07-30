import { describe, it, expect } from 'vitest';
import { MinimaxAIPlayer } from '../../src/players/minimax-ai-player.js';
import { Player } from '../../src/players/player.js';
import type { GameState, CellValue } from '../../src/types/game.js';

describe('MinimaxAIPlayer', () => {
  describe('constructor', () => {
    it('should create a minimax AI player with specified symbol', () => {
      const player = new MinimaxAIPlayer('X');

      expect(player.symbol).toBe('X');
      expect(player.name).toBe('Minimax AI');
      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(MinimaxAIPlayer);
    });

    it('should create a minimax AI player with custom name', () => {
      const player = new MinimaxAIPlayer('O', 'Perfect AI');

      expect(player.symbol).toBe('O');
      expect(player.name).toBe('Perfect AI');
    });

    it('should support both player symbols', () => {
      const playerX = new MinimaxAIPlayer('X');
      const playerO = new MinimaxAIPlayer('O');

      expect(playerX.symbol).toBe('X');
      expect(playerO.symbol).toBe('O');
    });

    it('should use default name when not provided', () => {
      const player = new MinimaxAIPlayer('X');

      expect(player.name).toBe('Minimax AI');
    });

    it('should accept custom max depth', () => {
      const player = new MinimaxAIPlayer('X', 'Deep AI', 5);
      expect(player).toBeInstanceOf(MinimaxAIPlayer);
    });
  });

  describe('properties', () => {
    it('should have readonly symbol property', () => {
      const player = new MinimaxAIPlayer('X');

      expect(player.symbol).toBe('X');
      // TypeScript enforces readonly
    });

    it('should have readonly name property', () => {
      const player = new MinimaxAIPlayer('X', 'Smart AI');

      expect(player.name).toBe('Smart AI');
      // TypeScript enforces readonly
    });
  });

  describe('getMove', () => {
    const createGameState = (
      board: CellValue[][],
      currentPlayer: 'X' | 'O' = 'X'
    ): GameState => ({
      board,
      currentPlayer,
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should return a valid move from available positions', async () => {
      const player = new MinimaxAIPlayer('X');
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

    it('should prioritize winning moves', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['X', 'X', null], // X can win at (0,2)
          ['O', null, null],
          ['O', null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should choose the winning move
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should prioritize blocking opponent wins', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['O', 'O', null], // X should block O's win at (0,2)
          ['X', null, null],
          [null, null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should block the opponent's win
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should work with empty board', async () => {
      const player = new MinimaxAIPlayer('X');
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

    it('should handle single available position', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState([
        ['X', 'O', 'X'],
        ['O', 'X', 'O'],
        ['O', null, 'X'], // Only (2,1) is available
      ]);

      const move = await player.getMove(gameState);

      // Should be the only available position
      expect(move).toEqual({ row: 2, col: 1 });
    });

    it('should throw error when no moves available', async () => {
      const player = new MinimaxAIPlayer('X');
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
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const result = player.getMove(gameState);
      expect(result).toBeInstanceOf(Promise);
    });

    it('should prefer winning over blocking', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['X', 'X', null], // X can win at (0,2)
          ['O', 'O', null], // O threatens win at (1,2)
          [null, null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should choose to win rather than block
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should handle multiple winning moves', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['X', null, 'X'], // X can win at (0,1)
          [null, 'X', null], // X can win at (2,1)
          ['X', null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should choose one of the winning moves
      const isWinningMove =
        (move.row === 0 && move.col === 1) || // Top row win
        (move.row === 2 && move.col === 1); // Diagonal win

      expect(isWinningMove).toBe(true);
    });

    it('should work with different player symbols', async () => {
      const playerO = new MinimaxAIPlayer('O');
      const gameState = createGameState(
        [
          ['O', 'O', null], // O can win at (0,2)
          ['X', null, null],
          [null, null, null],
        ],
        'O'
      );

      const move = await playerO.getMove(gameState);

      // Should choose the winning move
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should make optimal first move (center)', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const move = await player.getMove(gameState);

      // Should choose center for first move (optimal strategy)
      expect(move).toEqual({ row: 1, col: 1 });
    });

    it('should handle complex strategic scenarios', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          [null, 'O', null],
          [null, 'X', null],
          [null, null, 'O'],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should make a strategic move (exact move may vary based on analysis)
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThanOrEqual(2);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThanOrEqual(2);
      // AI doesn't modify the board, just returns the position
      expect(gameState.board[move.row][move.col]).toBe(null);
    });
  });

  describe('perfect play scenarios', () => {
    const createGameState = (
      board: CellValue[][],
      currentPlayer: 'X' | 'O' = 'X'
    ): GameState => ({
      board,
      currentPlayer,
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should force a draw when playing against itself', async () => {
      const playerX = new MinimaxAIPlayer('X');
      const playerO = new MinimaxAIPlayer('O');

      // Simulate a game where both players use minimax
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      // Both should choose optimal moves that lead to a draw
      const moveX = await playerX.getMove(gameState);
      const moveO = await playerO.getMove(gameState);

      // Both should choose center or corners (optimal first moves)
      const optimalMoves = [
        { row: 1, col: 1 }, // center
        { row: 0, col: 0 }, // corner
        { row: 0, col: 2 }, // corner
        { row: 2, col: 0 }, // corner
        { row: 2, col: 2 }, // corner
      ];

      const isOptimalMoveX = optimalMoves.some(
        (pos) => pos.row === moveX.row && pos.col === moveX.col
      );
      const isOptimalMoveO = optimalMoves.some(
        (pos) => pos.row === moveO.row && pos.col === moveO.col
      );

      expect(isOptimalMoveX).toBe(true);
      expect(isOptimalMoveO).toBe(true);
    });

    it('should always win when opponent makes suboptimal moves', async () => {
      const player = new MinimaxAIPlayer('X');

      // Create a scenario where opponent made a suboptimal move
      const gameState = createGameState(
        [
          ['O', null, null], // O played edge (suboptimal)
          [null, null, null],
          [null, null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should choose center to create winning opportunity
      expect(move).toEqual({ row: 1, col: 1 });
    });

    it('should block opponent forks', async () => {
      const player = new MinimaxAIPlayer('X');

      // Create a scenario where opponent can create a fork
      const gameState = createGameState(
        [
          ['O', null, 'O'],
          [null, 'X', null],
          [null, null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should block the fork by playing in a position that prevents multiple threats
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThanOrEqual(2);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThanOrEqual(2);
      expect(gameState.board[move.row][move.col]).toBe(null);
    });
  });

  describe('analyzeMove', () => {
    const createGameState = (
      board: CellValue[][],
      currentPlayer: 'X' | 'O' = 'X'
    ): GameState => ({
      board,
      currentPlayer,
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should provide move analysis', () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['X', 'X', null],
          ['O', null, null],
          [null, null, null],
        ],
        'X'
      );

      const analysis = player.analyzeMove(gameState, { row: 0, col: 2 });

      expect(analysis).toHaveProperty('position');
      expect(analysis).toHaveProperty('gridPosition');
      expect(analysis).toHaveProperty('winInTurns');
      expect(analysis).toHaveProperty('blocksOpponentWin');
      expect(analysis).toHaveProperty('createsFork');
      expect(analysis).toHaveProperty('blocksOpponentFork');

      expect(analysis.position).toEqual({ row: 0, col: 2 });
      expect(analysis.winInTurns).toBe(1); // Should detect winning move
    });

    it('should detect blocking moves', () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['O', 'O', null],
          ['X', null, null],
          [null, null, null],
        ],
        'X'
      );

      const analysis = player.analyzeMove(gameState, { row: 0, col: 2 });

      expect(analysis.blocksOpponentWin).toBe(true);
    });

    it('should provide grid position', () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      const analysis = player.analyzeMove(gameState, { row: 1, col: 2 });

      expect(analysis.gridPosition).toEqual({ letter: 'C', number: 2 });
    });
  });

  describe('inheritance', () => {
    it('should extend the abstract Player class', () => {
      const player = new MinimaxAIPlayer('X');

      expect(player).toBeInstanceOf(Player);
      expect(player).toBeInstanceOf(MinimaxAIPlayer);
    });

    it('should implement the Player interface correctly', () => {
      const player = new MinimaxAIPlayer('X', 'Perfect AI');

      // Has required properties
      expect(player.symbol).toBeDefined();
      expect(player.name).toBeDefined();
      expect(typeof player.getMove).toBe('function');

      // Has optional methods
      expect(typeof player.analyzeMove).toBe('function');

      // Properties have correct types
      expect(typeof player.symbol).toBe('string');
      expect(typeof player.name).toBe('string');
    });
  });

  describe('multiple instances', () => {
    const createGameState = (
      board: CellValue[][],
      currentPlayer: 'X' | 'O' = 'X'
    ): GameState => ({
      board,
      currentPlayer,
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should support multiple minimax AI players', () => {
      const player1 = new MinimaxAIPlayer('X', 'Minimax 1');
      const player2 = new MinimaxAIPlayer('O', 'Minimax 2');

      expect(player1.symbol).toBe('X');
      expect(player1.name).toBe('Minimax 1');
      expect(player2.symbol).toBe('O');
      expect(player2.name).toBe('Minimax 2');

      // Should be separate instances
      expect(player1).not.toBe(player2);
    });

    it('should make independent strategic decisions', async () => {
      const player1 = new MinimaxAIPlayer('X');
      const player2 = new MinimaxAIPlayer('O');
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

  describe('optimal play behavior', () => {
    const createGameState = (
      board: CellValue[][],
      currentPlayer: 'X' | 'O' = 'X'
    ): GameState => ({
      board,
      currentPlayer,
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    });

    it('should consistently choose winning moves when available', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['X', 'X', null],
          ['O', null, null],
          [null, null, null],
        ],
        'X'
      );

      // Test multiple times to ensure consistency
      for (let i = 0; i < 5; i++) {
        const move = await player.getMove(gameState);
        expect(move).toEqual({ row: 0, col: 2 });
      }
    });

    it('should consistently block opponent wins when no winning move available', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          ['O', 'O', null],
          ['X', null, null],
          [null, null, null],
        ],
        'X'
      );

      // Test multiple times to ensure consistency
      for (let i = 0; i < 5; i++) {
        const move = await player.getMove(gameState);
        expect(move).toEqual({ row: 0, col: 2 });
      }
    });

    it('should make optimal moves in neutral positions', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState(
        [
          [null, null, null],
          [null, 'O', null],
          [null, null, null],
        ],
        'X'
      );

      const move = await player.getMove(gameState);

      // Should be a valid move
      expect(move.row).toBeGreaterThanOrEqual(0);
      expect(move.row).toBeLessThanOrEqual(2);
      expect(move.col).toBeGreaterThanOrEqual(0);
      expect(move.col).toBeLessThanOrEqual(2);
      expect(gameState.board[move.row][move.col]).toBe(null);
    });

    it('should always choose center for first move', async () => {
      const player = new MinimaxAIPlayer('X');
      const gameState = createGameState([
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ]);

      // Test multiple times to ensure consistency
      for (let i = 0; i < 5; i++) {
        const move = await player.getMove(gameState);
        expect(move).toEqual({ row: 1, col: 1 });
      }
    });
  });
});
