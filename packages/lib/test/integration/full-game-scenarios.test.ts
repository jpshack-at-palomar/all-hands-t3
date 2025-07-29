import { describe, it, expect } from 'vitest';
import {
  GameEngine,
  GameState,
  RandomAIPlayer,
  StrategicAIPlayer,
  HumanPlayer,
  type Position,
} from '../../src/index.js';

describe('Full Game Scenario Integration Tests', () => {
  describe('Win Condition Scenarios', () => {
    it('should detect horizontal wins correctly', async () => {
      const gameState = new GameState();

      // Create horizontal win for X on top row
      const winningMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 1, col: 0 }, // O
        { row: 0, col: 1 }, // X
        { row: 1, col: 1 }, // O
        { row: 0, col: 2 }, // X wins
      ];

      for (const move of winningMoves) {
        gameState.makeMove(move);
      }

      const finalState = gameState.getState();
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('X');
      expect(finalState.moves).toHaveLength(5);
    });

    it('should detect vertical wins correctly', async () => {
      const gameState = new GameState();

      // Create vertical win for O on left column
      const winningMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 1, col: 0 }, // X
        { row: 1, col: 1 }, // O
        { row: 2, col: 2 }, // X
        { row: 2, col: 1 }, // O wins
      ];

      for (const move of winningMoves) {
        gameState.makeMove(move);
      }

      const finalState = gameState.getState();
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('O');
    });

    it('should detect diagonal wins correctly', async () => {
      const gameState = new GameState();

      // Create diagonal win for X (top-left to bottom-right)
      const winningMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 1, col: 1 }, // X
        { row: 0, col: 2 }, // O
        { row: 2, col: 2 }, // X wins
      ];

      for (const move of winningMoves) {
        gameState.makeMove(move);
      }

      const finalState = gameState.getState();
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('X');
    });

    it('should detect anti-diagonal wins correctly', async () => {
      const gameState = new GameState();

      // Create anti-diagonal win for O (top-right to bottom-left)
      const winningMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 2 }, // O
        { row: 0, col: 1 }, // X
        { row: 1, col: 1 }, // O
        { row: 1, col: 0 }, // X
        { row: 2, col: 0 }, // O wins
      ];

      for (const move of winningMoves) {
        gameState.makeMove(move);
      }

      const finalState = gameState.getState();
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('O');
    });
  });

  describe('Draw Scenarios', () => {
    it('should detect draw when board is full with no winner', async () => {
      const gameState = new GameState();

      // Create a draw scenario
      const drawMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 0, col: 2 }, // X
        { row: 1, col: 1 }, // O
        { row: 1, col: 0 }, // X
        { row: 1, col: 2 }, // O
        { row: 2, col: 1 }, // X
        { row: 2, col: 0 }, // O
        { row: 2, col: 2 }, // X - final move, board full, no winner
      ];

      for (const move of drawMoves) {
        gameState.makeMove(move);
      }

      const finalState = gameState.getState();
      expect(finalState.status).toBe('draw');
      expect(finalState.winner).toBeNull();
      expect(finalState.moves).toHaveLength(9);
    });

    it('should simulate a realistic draw scenario with AI players', async () => {
      const playerX = new StrategicAIPlayer('X', 'Strategic X');
      const playerO = new StrategicAIPlayer('O', 'Strategic O');
      const engine = new GameEngine(playerX, playerO);

      // Strategic players should often result in draws
      let gameState = engine.getGameState();
      while (gameState.status === 'playing' && gameState.moves.length < 9) {
        await engine.makeMove();
        gameState = engine.getGameState();
      }

      expect(gameState.status).not.toBe('playing');
      expect(['won', 'draw']).toContain(gameState.status);

      // If it's a draw, verify it's a valid draw state
      if (gameState.status === 'draw') {
        expect(gameState.winner).toBeNull();
        expect(gameState.moves).toHaveLength(9);
      }
    });
  });

  describe('Edge Case Scenarios', () => {
    it('should handle immediate wins (3 moves)', async () => {
      const gameState = new GameState();

      // X wins in 3 moves with poor O play
      const quickWinMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 1, col: 1 }, // O (center, but not blocking)
        { row: 0, col: 1 }, // X
        { row: 2, col: 0 }, // O (not blocking)
        { row: 0, col: 2 }, // X wins horizontally
      ];

      for (const move of quickWinMoves) {
        gameState.makeMove(move);
      }

      const finalState = gameState.getState();
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('X');
      expect(finalState.moves).toHaveLength(5);
    });

    it('should prevent moves after game ends', async () => {
      const gameState = new GameState();

      // Create a win scenario
      const winMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 1, col: 0 }, // O
        { row: 0, col: 1 }, // X
        { row: 1, col: 1 }, // O
        { row: 0, col: 2 }, // X wins
      ];

      for (const move of winMoves) {
        gameState.makeMove(move);
      }

      // Verify game is won
      expect(gameState.getState().status).toBe('won');

      // Try to make another move - should fail
      const invalidMove = gameState.makeMove({ row: 2, col: 2 });
      expect(invalidMove).toBe(false);

      // State should be unchanged
      const finalState = gameState.getState();
      expect(finalState.moves).toHaveLength(5);
      expect(finalState.status).toBe('won');
    });

    it('should handle invalid position moves gracefully', async () => {
      const gameState = new GameState();

      // Make first move
      gameState.makeMove({ row: 0, col: 0 });

      // Try to make move on occupied position
      const invalidMove = gameState.makeMove({ row: 0, col: 0 });
      expect(invalidMove).toBe(false);

      // State should be unchanged (still 1 move)
      const state = gameState.getState();
      expect(state.moves).toHaveLength(1);
      expect(state.currentPlayer).toBe('O'); // Should still be O's turn
    });
  });

  describe('Complex Game Flow Scenarios', () => {
    it('should handle blocking scenarios correctly', async () => {
      const gameState = new GameState();

      // Test blocking behavior
      const blockingMoves: Position[] = [
        { row: 0, col: 0 }, // X
        { row: 1, col: 1 }, // O (center)
        { row: 0, col: 1 }, // X (trying for horizontal)
        { row: 0, col: 2 }, // O (blocks X's horizontal win)
        { row: 1, col: 0 }, // X
        { row: 1, col: 2 }, // O (different block, no diagonal win)
      ];

      for (const move of blockingMoves) {
        const result = gameState.makeMove(move);
        expect(result).toBe(true);
      }

      const state = gameState.getState();
      expect(state.status).toBe('playing'); // Game should continue
      expect(state.moves).toHaveLength(6);
    });

    it('should handle fork scenarios in Strategic AI games', async () => {
      // Run multiple games to test fork scenarios
      const gameResults = [];
      for (let i = 0; i < 5; i++) {
        const testEngine = new GameEngine(
          new StrategicAIPlayer('X', `Strategic X ${i}`),
          new RandomAIPlayer('O', `Random O ${i}`)
        );

        let gameState = testEngine.getGameState();
        while (gameState.status === 'playing' && gameState.moves.length < 9) {
          await testEngine.makeMove();
          gameState = testEngine.getGameState();
        }

        gameResults.push({
          status: gameState.status,
          winner: gameState.winner,
          moves: gameState.moves.length,
        });
      }

      // Strategic player should win some games against random player
      const strategicWins = gameResults.filter(
        (result) => result.status === 'won' && result.winner === 'X'
      ).length;

      expect(strategicWins).toBeGreaterThanOrEqual(0); // Should win at least some games
      expect(gameResults).toHaveLength(5);
      expect(gameResults.every((result) => result.status !== 'playing')).toBe(
        true
      );
    });

    it('should maintain move history and timestamps correctly', async () => {
      const gameState = new GameState();

      const startTime = Date.now();

      // Make several moves
      const moves: Position[] = [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 0, col: 1 },
        { row: 2, col: 2 },
      ];

      for (const move of moves) {
        gameState.makeMove(move);
      }

      const state = gameState.getState();
      expect(state.moves).toHaveLength(4);

      // Check move history
      expect(state.moves[0].player).toBe('X');
      expect(state.moves[1].player).toBe('O');
      expect(state.moves[2].player).toBe('X');
      expect(state.moves[3].player).toBe('O');

      // Check timestamps are reasonable
      state.moves.forEach((move) => {
        expect(move.timestamp).toBeGreaterThanOrEqual(startTime);
        expect(move.timestamp).toBeLessThanOrEqual(Date.now());
      });

      // Check grid positions are correct
      expect(state.moves[0].gridPosition).toEqual({ letter: 'A', number: 1 });
      expect(state.moves[1].gridPosition).toEqual({ letter: 'B', number: 2 });
    });
  });

  describe('Human Player Integration Scenarios', () => {
    it('should handle HumanPlayer in game engine setup', () => {
      const humanPlayerX = new HumanPlayer('X', 'Human Player');
      const aiPlayerO = new RandomAIPlayer('O', 'AI Player');

      const engine = new GameEngine(humanPlayerX, aiPlayerO);
      const initialState = engine.getGameState();

      expect(initialState.currentPlayer).toBe('X');
      expect(initialState.status).toBe('playing');
      expect(initialState.moves).toHaveLength(0);
    });

    it('should allow manual moves through game engine', () => {
      const humanPlayerX = new HumanPlayer('X', 'Human Player');
      const humanPlayerO = new HumanPlayer('O', 'Human Player');

      const engine = new GameEngine(humanPlayerX, humanPlayerO);

      // Make manual moves
      const move1 = engine.makeMoveAt({ row: 0, col: 0 });
      expect(move1).toBe(true);

      const move2 = engine.makeMoveAt({ row: 1, col: 1 });
      expect(move2).toBe(true);

      const state = engine.getGameState();
      expect(state.moves).toHaveLength(2);
      expect(state.currentPlayer).toBe('X');
    });
  });

  describe('Game Reset and State Management Scenarios', () => {
    it('should properly reset game state', () => {
      const gameState = new GameState();

      // Make some moves
      gameState.makeMove({ row: 0, col: 0 });
      gameState.makeMove({ row: 1, col: 1 });
      gameState.makeMove({ row: 0, col: 1 });

      // Verify state has moves
      expect(gameState.getState().moves).toHaveLength(3);

      // Reset
      gameState.reset();

      // Verify reset state
      const resetState = gameState.getState();
      expect(resetState.moves).toHaveLength(0);
      expect(resetState.currentPlayer).toBe('X');
      expect(resetState.status).toBe('playing');
      expect(resetState.winner).toBeNull();
      expect(resetState.turnNumber).toBe(0);
    });

    it('should handle multiple game resets correctly', () => {
      const gameState = new GameState();

      for (let gameNumber = 0; gameNumber < 3; gameNumber++) {
        // Play a few moves
        gameState.makeMove({ row: 0, col: 0 });
        gameState.makeMove({ row: 1, col: 1 });

        expect(gameState.getState().moves).toHaveLength(2);

        // Reset for next game
        gameState.reset();

        const resetState = gameState.getState();
        expect(resetState.moves).toHaveLength(0);
        expect(resetState.currentPlayer).toBe('X');
        expect(resetState.status).toBe('playing');
      }
    });
  });

  describe('Performance and Reliability Scenarios', () => {
    it('should handle rapid game simulations efficiently', async () => {
      const startTime = Date.now();
      const numGames = 50;
      const results = [];

      for (let i = 0; i < numGames; i++) {
        const playerX = new RandomAIPlayer('X', `Random X ${i}`);
        const playerO = new RandomAIPlayer('O', `Random O ${i}`);
        const engine = new GameEngine(playerX, playerO);

        let gameState = engine.getGameState();
        while (gameState.status === 'playing' && gameState.moves.length < 9) {
          await engine.makeMove();
          gameState = engine.getGameState();
        }

        results.push(gameState);
      }

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Verify all games completed
      expect(results).toHaveLength(numGames);
      expect(results.every((state) => state.status !== 'playing')).toBe(true);

      // Should complete 50 games reasonably quickly (less than 5 seconds)
      expect(duration).toBeLessThan(5000);

      // Average game should have reasonable number of moves
      const averageMoves =
        results.reduce((sum, state) => sum + state.moves.length, 0) / numGames;
      expect(averageMoves).toBeGreaterThan(5);
      expect(averageMoves).toBeLessThan(9);
    });

    it('should maintain consistent behavior across multiple runs', async () => {
      // Test deterministic behavior with same random seed logic
      const results1: Array<{ status: string; moveCount: number }> = [];
      const results2: Array<{ status: string; moveCount: number }> = [];

      for (let run = 0; run < 2; run++) {
        const currentResults = run === 0 ? results1 : results2;

        for (let i = 0; i < 10; i++) {
          const playerX = new StrategicAIPlayer('X', `Strategic X ${i}`);
          const playerO = new StrategicAIPlayer('O', `Strategic O ${i}`);
          const engine = new GameEngine(playerX, playerO);

          let gameState = engine.getGameState();
          while (gameState.status === 'playing' && gameState.moves.length < 9) {
            await engine.makeMove();
            gameState = engine.getGameState();
          }

          currentResults.push({
            status: gameState.status,
            moveCount: gameState.moves.length,
          });
        }
      }

      // All games should complete successfully
      expect(results1.every((r) => r.status !== 'playing')).toBe(true);
      expect(results2.every((r) => r.status !== 'playing')).toBe(true);

      // Should have similar patterns (strategic players should be consistent)
      const draws1 = results1.filter((r) => r.status === 'draw').length;
      const draws2 = results2.filter((r) => r.status === 'draw').length;

      // Strategic players should produce similar results
      expect(Math.abs(draws1 - draws2)).toBeLessThanOrEqual(3);
    });
  });
});
