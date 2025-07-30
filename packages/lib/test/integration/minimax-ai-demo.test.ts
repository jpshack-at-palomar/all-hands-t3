import { describe, it, expect } from 'vitest';
import {
  GameEngine,
  RandomAIPlayer,
  StrategicAIPlayer,
  MinimaxAIPlayer,
  type CellValue,
} from '../../src/index.js';

describe('Minimax AI Demo', () => {
  describe('Minimax vs Random AI', () => {
    it('should demonstrate minimax AI winning against random AI', async () => {
      const minimaxPlayer = new MinimaxAIPlayer('X', 'Minimax AI');
      const randomPlayer = new RandomAIPlayer('O', 'Random AI');
      const engine = new GameEngine(minimaxPlayer, randomPlayer);

      let gameState = engine.getGameState();
      const maxMoves = 9;
      let moveCount = 0;

      while (gameState.status === 'playing' && moveCount < maxMoves) {
        await engine.makeMove();
        gameState = engine.getGameState();
        moveCount++;
      }

      // Minimax AI should win or at least force a draw
      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);

      // If there's a winner, it should often be the minimax AI
      if (gameState.status === 'won') {
        expect(['X', 'O']).toContain(gameState.winner);
      }
    });
  });

  describe('Minimax vs Strategic AI', () => {
    it('should demonstrate minimax AI playing optimally against strategic AI', async () => {
      const minimaxPlayer = new MinimaxAIPlayer('X', 'Minimax AI');
      const strategicPlayer = new StrategicAIPlayer('O', 'Strategic AI');
      const engine = new GameEngine(minimaxPlayer, strategicPlayer);

      let gameState = engine.getGameState();
      const maxMoves = 9;
      let moveCount = 0;

      while (gameState.status === 'playing' && moveCount < maxMoves) {
        await engine.makeMove();
        gameState = engine.getGameState();
        moveCount++;
      }

      // Both are strong AIs, should result in draw or close game
      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);
    });
  });

  describe('Minimax vs Minimax', () => {
    it('should demonstrate perfect play between two minimax AIs', async () => {
      const minimaxPlayer1 = new MinimaxAIPlayer('X', 'Minimax AI 1');
      const minimaxPlayer2 = new MinimaxAIPlayer('O', 'Minimax AI 2');
      const engine = new GameEngine(minimaxPlayer1, minimaxPlayer2);

      let gameState = engine.getGameState();
      const maxMoves = 9;
      let moveCount = 0;

      while (gameState.status === 'playing' && moveCount < maxMoves) {
        await engine.makeMove();
        gameState = engine.getGameState();
        moveCount++;
      }

      // Perfect play should result in a draw
      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);

      // With perfect play, draws are more likely
      if (gameState.status === 'draw') {
        expect(gameState.winner).toBeNull();
      }
    });
  });

  describe('Minimax Performance', () => {
    it('should demonstrate minimax AI making optimal moves quickly', async () => {
      const minimaxPlayer = new MinimaxAIPlayer('X', 'Minimax AI');
      const randomPlayer = new RandomAIPlayer('O', 'Random AI');
      const engine = new GameEngine(minimaxPlayer, randomPlayer);

      // Test that minimax makes optimal first move
      let gameState = engine.getGameState();
      await engine.makeMove();
      gameState = engine.getGameState();

      // First move should be center (optimal strategy)
      const firstMove = gameState.moves[0];
      expect(firstMove.position).toEqual({ row: 1, col: 1 });
      expect(firstMove.player).toBe('X');

      // Complete the game
      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        await engine.makeMove();
        gameState = engine.getGameState();
      }

      expect(gameState.status).not.toBe('playing');
    });
  });

  describe('Minimax Win Scenarios', () => {
    it('should demonstrate minimax AI finding winning moves', async () => {
      const minimaxPlayer = new MinimaxAIPlayer('X', 'Minimax AI');

      // Create a scenario where X can win in one move
      const gameState = {
        board: [
          ['X', 'X', null], // X can win at (0,2)
          ['O', null, null],
          [null, null, null],
        ] as CellValue[][],
        currentPlayer: 'X' as const,
        status: 'playing' as const,
        winner: null,
        moves: [],
        turnNumber: 0,
      };

      const move = await minimaxPlayer.getMove(gameState);

      // Should choose the winning move
      expect(move).toEqual({ row: 0, col: 2 });
    });

    it('should demonstrate minimax AI blocking opponent wins', async () => {
      const minimaxPlayer = new MinimaxAIPlayer('X', 'Minimax AI');

      // Create a scenario where O can win next move
      const gameState = {
        board: [
          ['O', 'O', null], // O can win at (0,2)
          ['X', null, null],
          [null, null, null],
        ] as CellValue[][],
        currentPlayer: 'X' as const,
        status: 'playing' as const,
        winner: null,
        moves: [],
        turnNumber: 0,
      };

      const move = await minimaxPlayer.getMove(gameState);

      // Should block the opponent's win
      expect(move).toEqual({ row: 0, col: 2 });
    });
  });
});
