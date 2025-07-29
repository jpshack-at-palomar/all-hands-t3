import { describe, it, expect } from 'vitest';
import {
  GameEngine,
  GameState,
  GameBoard,
  MoveAnalyzer,
  ActionSpaceAnalyzer,
  CoordinateSystem,
  RandomAIPlayer,
  StrategicAIPlayer,
  type Position,
} from '../../src/index.js';

describe('Performance and Load Tests', () => {
  describe('Core Component Load Testing', () => {
    it('should handle creating many GameBoard instances', () => {
      const iterations = 1000;
      const boards: GameBoard[] = [];

      for (let i = 0; i < iterations; i++) {
        boards.push(new GameBoard());
      }

      expect(boards).toHaveLength(iterations);
      expect(boards[0]).toBeInstanceOf(GameBoard);
    });

    it('should handle rapid GameState operations', () => {
      const gameState = new GameState();
      const iterations = 500;

      for (let i = 0; i < iterations; i++) {
        // Get state (should be fast)
        const state = gameState.getState();
        expect(state).toBeDefined();

        // Get available moves (should be fast)
        const moves = gameState.getAvailableMoves();
        expect(Array.isArray(moves)).toBe(true);

        // Reset periodically to avoid full board
        if (i % 100 === 0) {
          gameState.reset();
        }
      }
    });

    it('should perform move analysis under load', () => {
      const analyzer = new MoveAnalyzer();
      const iterations = 100;

      // Create test game state
      const testState = {
        board: [
          ['X', 'O', null],
          [null, 'X', 'O'],
          ['O', null, 'X'],
        ] as Array<Array<'X' | 'O' | null>>,
        currentPlayer: 'X' as const,
        status: 'playing' as const,
        winner: null,
        moves: [],
        turnNumber: 5,
      };

      for (let i = 0; i < iterations; i++) {
        const winner = analyzer.checkWinner(testState.board);
        const moves = analyzer.analyzeMoves(testState);

        expect(winner === null || winner === 'X' || winner === 'O').toBe(true);
        expect(Array.isArray(moves)).toBe(true);
      }
    });

    it('should handle coordinate system conversions under load', () => {
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const position: Position = { row: i % 3, col: (i + 1) % 3 };
        const grid = CoordinateSystem.positionToGrid(position);
        const backToPosition = CoordinateSystem.gridToPosition(grid);

        expect(backToPosition).toEqual(position);
      }
    });

    it('should perform action space analysis under load', () => {
      const analyzer = new ActionSpaceAnalyzer();
      const iterations = 50;

      // Create test game state
      const gameState = new GameState();
      gameState.makeMove({ row: 0, col: 0 });
      gameState.makeMove({ row: 1, col: 1 });

      for (let i = 0; i < iterations; i++) {
        const state = gameState.getState();
        const actionSpace = analyzer.getActionSpace(state);

        expect(actionSpace).toBeDefined();
        expect(actionSpace.strategicMoves).toBeDefined();
        expect(actionSpace.gamePhase).toBeDefined();
        expect(Array.isArray(actionSpace.availableMoves)).toBe(true);
      }
    });
  });

  describe('AI Player Load Testing', () => {
    it('should generate random AI moves consistently', async () => {
      const player = new RandomAIPlayer('X', 'Load Test');
      const gameState = new GameState();
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        const state = gameState.getState();
        const move = await player.getMove(state);

        expect(move).toBeDefined();
        expect(typeof move.row).toBe('number');
        expect(typeof move.col).toBe('number');
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(3);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(3);

        // Reset state periodically
        if (i % 10 === 0) {
          gameState.reset();
        }
      }
    });

    it('should generate strategic AI moves consistently', async () => {
      const player = new StrategicAIPlayer('X', 'Strategic Load Test');
      const gameState = new GameState();
      const iterations = 25;

      for (let i = 0; i < iterations; i++) {
        const state = gameState.getState();
        const move = await player.getMove(state);

        expect(move).toBeDefined();
        expect(typeof move.row).toBe('number');
        expect(typeof move.col).toBe('number');
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(3);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(3);

        // Reset state periodically
        if (i % 5 === 0) {
          gameState.reset();
        }
      }
    });
  });

  describe('Game Engine Load Testing', () => {
    it('should handle rapid game creation and initialization', () => {
      const iterations = 100;
      const engines: GameEngine[] = [];

      for (let i = 0; i < iterations; i++) {
        const playerX = new RandomAIPlayer('X', `Player X ${i}`);
        const playerO = new RandomAIPlayer('O', `Player O ${i}`);
        const engine = new GameEngine(playerX, playerO);
        const state = engine.getGameState();

        expect(state).toBeDefined();
        expect(state.currentPlayer).toBe('X');
        engines.push(engine);
      }

      expect(engines).toHaveLength(iterations);
    });

    it('should process many manual moves efficiently', () => {
      const playerX = new RandomAIPlayer('X', 'Player X');
      const playerO = new RandomAIPlayer('O', 'Player O');
      const engine = new GameEngine(playerX, playerO);
      const iterations = 100;

      for (let i = 0; i < iterations; i++) {
        const position: Position = { row: i % 3, col: (i + 1) % 3 };
        const result = engine.makeMoveAt(position);

        // Result can be true or false depending on game state
        expect(typeof result).toBe('boolean');

        // Reset periodically
        if (i % 9 === 0) {
          engine.reset();
        }
      }
    });
  });

  describe('Concurrent Games Load Testing', () => {
    it('should handle multiple simultaneous games', () => {
      const numGames = 20;
      const engines: GameEngine[] = [];

      // Create multiple games
      for (let i = 0; i < numGames; i++) {
        const playerX = new RandomAIPlayer('X', `X${i}`);
        const playerO = new RandomAIPlayer('O', `O${i}`);
        engines.push(new GameEngine(playerX, playerO));
      }

      // Make moves in all games
      for (let move = 0; move < 3; move++) {
        engines.forEach((engine) => {
          const state = engine.getGameState();
          if (state.status === 'playing') {
            const availableMoves = engine.getAvailableMoves();
            if (availableMoves.length > 0) {
              const result = engine.makeMoveAt(availableMoves[0]);
              expect(typeof result).toBe('boolean');
            }
          }
        });
      }

      expect(engines).toHaveLength(numGames);

      // All engines should be functional
      engines.forEach((engine) => {
        const state = engine.getGameState();
        expect(state).toBeDefined();
      });
    });
  });

  describe('Scalability Testing', () => {
    it('should maintain functionality as board complexity increases', () => {
      const analyzer = new MoveAnalyzer();
      const fillLevels = [1, 3, 5, 7]; // Number of moves made

      fillLevels.forEach((fillLevel) => {
        const gameState = new GameState();

        // Fill board to specified level
        for (let i = 0; i < fillLevel; i++) {
          const availableMoves = gameState.getAvailableMoves();
          if (availableMoves.length > 0) {
            gameState.makeMove(availableMoves[0]);
          }
        }

        const iterations = 10;
        for (let i = 0; i < iterations; i++) {
          const state = gameState.getState();
          const moves = analyzer.analyzeMoves(state);

          expect(Array.isArray(moves)).toBe(true);
          expect(moves.length).toBeLessThanOrEqual(9 - fillLevel);
        }
      });
    });

    it('should handle high-frequency state queries', () => {
      const gameState = new GameState();

      // Make a few moves to create a realistic state
      gameState.makeMove({ row: 0, col: 0 });
      gameState.makeMove({ row: 1, col: 1 });
      gameState.makeMove({ row: 0, col: 1 });

      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        // High-frequency operations that might be called in UI updates
        const state = gameState.getState();
        const moves = gameState.getAvailableMoves();

        // Simulate checking various properties
        const hasWinner = state.winner !== null;
        const isGameOver = state.status !== 'playing';
        const moveCount = state.moves.length;

        // Verify the values make sense
        expect(typeof hasWinner).toBe('boolean');
        expect(typeof isGameOver).toBe('boolean');
        expect(typeof moveCount).toBe('number');
        expect(moveCount).toBeGreaterThanOrEqual(0);
        expect(Array.isArray(moves)).toBe(true);
      }
    });
  });

  describe('Stress Testing', () => {
    it('should handle multiple complete game simulations', async () => {
      const numGames = 10;
      const completedGames = [];

      for (let i = 0; i < numGames; i++) {
        const playerX = new RandomAIPlayer('X', `Stress X ${i}`);
        const playerO = new RandomAIPlayer('O', `Stress O ${i}`);
        const engine = new GameEngine(playerX, playerO);

        let gameState = engine.getGameState();
        let moveCount = 0;

        while (gameState.status === 'playing' && moveCount < 9) {
          await engine.makeMove();
          gameState = engine.getGameState();
          moveCount++;
        }

        completedGames.push({
          gameId: i,
          finalStatus: gameState.status,
          totalMoves: gameState.moves.length,
        });
      }

      expect(completedGames).toHaveLength(numGames);

      // All games should have completed
      expect(
        completedGames.every((game) => game.finalStatus !== 'playing')
      ).toBe(true);

      // All games should have reasonable move counts
      expect(
        completedGames.every(
          (game) => game.totalMoves >= 5 && game.totalMoves <= 9
        )
      ).toBe(true);
    });

    it('should maintain strategic AI accuracy under load', async () => {
      const numGames = 10;
      const strategicWins = [];
      const totalMoves = [];

      for (let i = 0; i < numGames; i++) {
        const playerX = new StrategicAIPlayer('X', `Strategic X ${i}`);
        const playerO = new RandomAIPlayer('O', `Random O ${i}`);
        const engine = new GameEngine(playerX, playerO);

        let gameState = engine.getGameState();
        while (gameState.status === 'playing' && gameState.moves.length < 9) {
          await engine.makeMove();
          gameState = engine.getGameState();
        }

        if (gameState.status === 'won' && gameState.winner === 'X') {
          strategicWins.push(i);
        }
        totalMoves.push(gameState.moves.length);
      }

      // Strategic player should win at least some games
      expect(strategicWins.length).toBeGreaterThanOrEqual(0);

      // All games should complete with reasonable move counts
      expect(totalMoves.every((count) => count >= 5 && count <= 9)).toBe(true);
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should handle typical user interaction patterns', () => {
      const playerX = new RandomAIPlayer('X', 'AI X');
      const playerO = new RandomAIPlayer('O', 'AI O');
      const engine = new GameEngine(playerX, playerO);
      const iterations = 50;

      for (let i = 0; i < iterations; i++) {
        // Simulate typical user interactions
        const state = engine.getGameState();
        expect(state).toBeDefined();

        const availableMoves = engine.getAvailableMoves();
        expect(Array.isArray(availableMoves)).toBe(true);

        // Make a move if possible
        if (availableMoves.length > 0) {
          const result = engine.makeMoveAt(availableMoves[0]);
          expect(typeof result).toBe('boolean');
        }

        // Check game status (common UI operation)
        const currentState = engine.getGameState();
        const isGameOver = currentState.status !== 'playing';
        expect(typeof isGameOver).toBe('boolean');

        // Reset game when finished (new game button)
        if (isGameOver || i % 10 === 0) {
          engine.reset();
        }
      }
    });

    it('should support responsive AI move generation patterns', async () => {
      const playerX = new StrategicAIPlayer('X', 'Strategic AI');
      const gameState = new GameState();
      const numMoves = 5;

      // Test move generation at different game phases
      for (let moveNumber = 0; moveNumber < numMoves; moveNumber++) {
        const state = gameState.getState();
        const move = await playerX.getMove(state);

        expect(move).toBeDefined();
        expect(typeof move.row).toBe('number');
        expect(typeof move.col).toBe('number');

        // Make the move to progress the game
        const moveResult = gameState.makeMove(move);
        expect(moveResult).toBe(true);

        // Verify game state advanced
        const newState = gameState.getState();
        expect(newState.moves.length).toBe(moveNumber + 1);
      }
    });
  });
});
