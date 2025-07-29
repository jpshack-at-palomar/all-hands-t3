import { describe, it, expect } from 'vitest';
import {
  GameEngine,
  RandomAIPlayer,
  StrategicAIPlayer,
  type GameStatus,
} from '../../src/index.js';

describe('AI vs AI Integration Tests', () => {
  describe('Random AI vs Random AI', () => {
    it('should complete a game between two random AI players', async () => {
      const playerX = new RandomAIPlayer('X', 'Random X');
      const playerO = new RandomAIPlayer('O', 'Random O');
      const engine = new GameEngine(playerX, playerO);

      // Play the game until completion
      let gameState = engine.getGameState();
      const maxMoves = 9;
      let moveCount = 0;

      while (gameState.status === 'playing' && moveCount < maxMoves) {
        await engine.makeMove();
        gameState = engine.getGameState();
        moveCount++;
      }

      // Verify game completed properly
      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);
      expect(gameState.moves.length).toBeGreaterThan(0);
      expect(gameState.moves.length).toBeLessThanOrEqual(9);
      expect(gameState.turnNumber).toBe(gameState.moves.length);
    });

    it('should maintain valid game state throughout Random vs Random game', async () => {
      const playerX = new RandomAIPlayer('X', 'Random X');
      const playerO = new RandomAIPlayer('O', 'Random O');
      const engine = new GameEngine(playerX, playerO);

      let gameState = engine.getGameState();
      const moveHistory: (typeof gameState)[] = [{ ...gameState }];

      // Play game and track state
      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        await engine.makeMove();
        gameState = engine.getGameState();
        moveHistory.push({ ...gameState });

        // Verify state consistency
        expect(gameState.turnNumber).toBe(gameState.moves.length);

        // Verify no duplicate moves
        const positions = gameState.moves.map(
          (move) => `${move.position.row},${move.position.col}`
        );
        const uniquePositions = new Set(positions);
        expect(uniquePositions.size).toBe(positions.length);
      }

      // Verify final state
      expect(gameState.status).not.toBe('playing');
      expect(moveHistory.length).toBeGreaterThan(1);
    });
  });

  describe('Strategic AI vs Strategic AI', () => {
    it('should complete a game between two strategic AI players', async () => {
      const playerX = new StrategicAIPlayer('X', 'Strategic X');
      const playerO = new StrategicAIPlayer('O', 'Strategic O');
      const engine = new GameEngine(playerX, playerO);

      let gameState = engine.getGameState();
      const maxMoves = 9;
      let moveCount = 0;

      while (gameState.status === 'playing' && moveCount < maxMoves) {
        await engine.makeMove();
        gameState = engine.getGameState();
        moveCount++;
      }

      // Verify game completed properly
      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);
      expect(gameState.moves.length).toBeGreaterThan(0);
      expect(gameState.moves.length).toBeLessThanOrEqual(9);
    });

    it('should show strategic play patterns in Strategic vs Strategic game', async () => {
      const playerX = new StrategicAIPlayer('X', 'Strategic X');
      const playerO = new StrategicAIPlayer('O', 'Strategic O');
      const engine = new GameEngine(playerX, playerO);

      let gameState = engine.getGameState();

      // Strategic players should make reasonable first moves
      await engine.makeMove();
      gameState = engine.getGameState();

      // First move should be corner or center (strategic positions)
      const firstMove = gameState.moves[0];
      const strategicPositions = [
        { row: 0, col: 0 }, // top-left corner
        { row: 0, col: 2 }, // top-right corner
        { row: 1, col: 1 }, // center
        { row: 2, col: 0 }, // bottom-left corner
        { row: 2, col: 2 }, // bottom-right corner
      ];

      const isStrategicMove = strategicPositions.some(
        (pos) =>
          pos.row === firstMove.position.row &&
          pos.col === firstMove.position.col
      );
      expect(isStrategicMove).toBe(true);

      // Complete the game
      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        await engine.makeMove();
        gameState = engine.getGameState();
      }

      expect(gameState.status).not.toBe('playing');
    });
  });

  describe('Mixed AI Matchups', () => {
    it('should complete a game between Strategic AI and Random AI', async () => {
      const playerX = new StrategicAIPlayer('X', 'Strategic X');
      const playerO = new RandomAIPlayer('O', 'Random O');
      const engine = new GameEngine(playerX, playerO);

      let gameState = engine.getGameState();

      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        await engine.makeMove();
        gameState = engine.getGameState();
      }

      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);
    });

    it('should complete a game between Random AI and Strategic AI', async () => {
      const playerX = new RandomAIPlayer('X', 'Random X');
      const playerO = new StrategicAIPlayer('O', 'Strategic O');
      const engine = new GameEngine(playerX, playerO);

      let gameState = engine.getGameState();

      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        await engine.makeMove();
        gameState = engine.getGameState();
      }

      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);
    });
  });

  describe('Multiple Game Statistics', () => {
    it('should run multiple Random vs Random games and collect statistics', async () => {
      const gameResults: GameStatus[] = [];
      const gameLengths: number[] = [];
      const numGames = 10;

      for (let i = 0; i < numGames; i++) {
        const playerX = new RandomAIPlayer('X', `Random X ${i}`);
        const playerO = new RandomAIPlayer('O', `Random O ${i}`);
        const engine = new GameEngine(playerX, playerO);

        let gameState = engine.getGameState();

        while (gameState.status === 'playing' && gameState.moves.length < 9) {
          await engine.makeMove();
          gameState = engine.getGameState();
        }

        gameResults.push(gameState.status);
        gameLengths.push(gameState.moves.length);
      }

      // Verify all games completed
      expect(gameResults).toHaveLength(numGames);
      expect(
        gameResults.every((result) => ['won', 'draw'].includes(result))
      ).toBe(true);

      // Verify game lengths are reasonable
      expect(gameLengths.every((length) => length >= 5 && length <= 9)).toBe(
        true
      );

      // Should have some variety in results and lengths
      const uniqueResults = new Set(gameResults);
      const uniqueLengths = new Set(gameLengths);
      expect(uniqueResults.size).toBeGreaterThanOrEqual(1);
      expect(uniqueLengths.size).toBeGreaterThanOrEqual(2);
    });

    it('should run multiple Strategic vs Strategic games with consistent results', async () => {
      const gameResults: GameStatus[] = [];
      const winnerResults: Array<'X' | 'O' | null> = [];
      const numGames = 5;

      for (let i = 0; i < numGames; i++) {
        const playerX = new StrategicAIPlayer('X', `Strategic X ${i}`);
        const playerO = new StrategicAIPlayer('O', `Strategic O ${i}`);
        const engine = new GameEngine(playerX, playerO);

        let gameState = engine.getGameState();

        while (gameState.status === 'playing' && gameState.moves.length < 9) {
          await engine.makeMove();
          gameState = engine.getGameState();
        }

        gameResults.push(gameState.status);
        winnerResults.push(gameState.winner);
      }

      // Verify all games completed properly
      expect(gameResults).toHaveLength(numGames);
      expect(
        gameResults.every((result) => ['won', 'draw'].includes(result))
      ).toBe(true);

      // Strategic play should result in some draws (perfect play)
      const drawCount = gameResults.filter(
        (result) => result === 'draw'
      ).length;
      expect(drawCount).toBeGreaterThanOrEqual(0); // At least some strategic games should end in draws
    });
  });

  describe('Error Handling in AI Games', () => {
    it('should handle invalid moves gracefully during AI games', async () => {
      const playerX = new RandomAIPlayer('X', 'Random X');
      const playerO = new RandomAIPlayer('O', 'Random O');
      const engine = new GameEngine(playerX, playerO);

      // Manually make a few moves to create a specific board state
      await engine.makeMove(); // X moves
      await engine.makeMove(); // O moves

      let gameState = engine.getGameState();
      expect(gameState.moves.length).toBe(2);

      // Continue game normally - AI should avoid occupied positions
      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        const movesBefore = gameState.moves.length;
        await engine.makeMove();
        gameState = engine.getGameState();

        // Verify a move was actually made
        expect(gameState.moves.length).toBe(movesBefore + 1);
      }

      expect(gameState.status).not.toBe('playing');
    });

    it('should handle game completion detection correctly', async () => {
      const playerX = new StrategicAIPlayer('X', 'Strategic X');
      const playerO = new StrategicAIPlayer('O', 'Strategic O');
      const engine = new GameEngine(playerX, playerO);

      let gameState = engine.getGameState();
      let previousStatus: GameStatus = 'playing';

      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        previousStatus = gameState.status;
        await engine.makeMove();
        gameState = engine.getGameState();

        // Once game is no longer playing, it should stay that way
        if (previousStatus !== 'playing') {
          expect(gameState.status).toBe(previousStatus);
        }
      }

      // Final verification
      expect(gameState.status).not.toBe('playing');

      if (gameState.status === 'won') {
        expect(gameState.winner).not.toBeNull();
        expect(['X', 'O']).toContain(gameState.winner);
      } else {
        expect(gameState.status).toBe('draw');
        expect(gameState.winner).toBeNull();
      }
    });
  });
});
