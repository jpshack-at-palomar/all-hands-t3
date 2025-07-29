import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../../src/game/game-engine.js';
import { Player } from '../../src/players/player.js';
import { HumanPlayer } from '../../src/players/human-player.js';
import { RandomAIPlayer } from '../../src/players/random-ai-player.js';
import type {
  Player as PlayerType,
  Position,
  GameState,
} from '../../src/types/game.js';

// Mock player for testing
class MockPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;
  private mockMoves: Position[];
  private moveIndex: number = 0;

  constructor(symbol: PlayerType, name: string, mockMoves: Position[] = []) {
    super();
    this.symbol = symbol;
    this.name = name;
    this.mockMoves = mockMoves;
  }

  async getMove(gameState: GameState): Promise<Position> {
    void gameState; // Avoid unused parameter warning
    if (this.moveIndex < this.mockMoves.length) {
      return this.mockMoves[this.moveIndex++];
    }
    throw new Error('No more mock moves available');
  }

  setMockMoves(moves: Position[]): void {
    this.mockMoves = moves;
    this.moveIndex = 0;
  }
}

describe('GameEngine', () => {
  let playerX: MockPlayer;
  let playerO: MockPlayer;
  let engine: GameEngine;

  beforeEach(() => {
    playerX = new MockPlayer('X', 'Player X');
    playerO = new MockPlayer('O', 'Player O');
    engine = new GameEngine(playerX, playerO);
  });

  describe('constructor', () => {
    it('should create a game engine with two players', () => {
      expect(engine).toBeInstanceOf(GameEngine);

      const state = engine.getGameState();
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.winner).toBe(null);
    });

    it('should work with different player types', () => {
      const humanPlayer = new HumanPlayer('X', 'Human');
      const aiPlayer = new RandomAIPlayer('O', 'AI');
      const mixedEngine = new GameEngine(humanPlayer, aiPlayer);

      expect(mixedEngine).toBeInstanceOf(GameEngine);
      expect(mixedEngine.getGameState().currentPlayer).toBe('X');
    });
  });

  describe('getGameState', () => {
    it('should return current game state', () => {
      const state = engine.getGameState();

      expect(state).toHaveProperty('board');
      expect(state).toHaveProperty('currentPlayer');
      expect(state).toHaveProperty('status');
      expect(state).toHaveProperty('winner');
      expect(state).toHaveProperty('moves');
      expect(state).toHaveProperty('turnNumber');

      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.moves).toHaveLength(0);
    });

    it('should return a copy of the state', () => {
      const state1 = engine.getGameState();
      const state2 = engine.getGameState();

      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2);
    });
  });

  describe('makeMove', () => {
    it('should make moves for players automatically', async () => {
      playerX.setMockMoves([{ row: 0, col: 0 }]);
      playerO.setMockMoves([{ row: 1, col: 1 }]);

      // X's turn
      const result1 = await engine.makeMove();
      expect(result1).toBe(true);

      let state = engine.getGameState();
      expect(state.board[0][0]).toBe('X');
      expect(state.currentPlayer).toBe('O');
      expect(state.turnNumber).toBe(1);

      // O's turn
      const result2 = await engine.makeMove();
      expect(result2).toBe(true);

      state = engine.getGameState();
      expect(state.board[1][1]).toBe('O');
      expect(state.currentPlayer).toBe('X');
      expect(state.turnNumber).toBe(2);
    });

    it('should return false when game is over', async () => {
      // Set up a winning scenario
      playerX.setMockMoves([
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // X
        { row: 0, col: 2 }, // X wins
      ]);
      playerO.setMockMoves([
        { row: 1, col: 0 }, // O
        { row: 1, col: 1 }, // O
      ]);

      await engine.makeMove(); // X
      await engine.makeMove(); // O
      await engine.makeMove(); // X
      await engine.makeMove(); // O
      await engine.makeMove(); // X wins

      // Game should be over now
      const result = await engine.makeMove();
      expect(result).toBe(false);
    });

    it('should handle player errors gracefully', async () => {
      playerX.setMockMoves([]); // No moves available

      await expect(engine.makeMove()).rejects.toThrow(
        'No more mock moves available'
      );
    });
  });

  describe('makeMoveAt', () => {
    it('should make a move at specific position', () => {
      const result = engine.makeMoveAt({ row: 1, col: 1 });
      expect(result).toBe(true);

      const state = engine.getGameState();
      expect(state.board[1][1]).toBe('X');
      expect(state.currentPlayer).toBe('O');
    });

    it('should reject invalid moves', () => {
      engine.makeMoveAt({ row: 0, col: 0 });

      // Try to move to same position
      const result = engine.makeMoveAt({ row: 0, col: 0 });
      expect(result).toBe(false);
    });

    it('should work with human players', () => {
      const humanEngine = GameEngine.createHumanVsHuman();

      const result = humanEngine.makeMoveAt({ row: 2, col: 2 });
      expect(result).toBe(true);

      const state = humanEngine.getGameState();
      expect(state.board[2][2]).toBe('X');
    });
  });

  describe('getAvailableMoves', () => {
    it('should return all available moves initially', () => {
      const moves = engine.getAvailableMoves();
      expect(moves).toHaveLength(9);

      // Check all positions are included
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(moves).toContainEqual({ row, col });
        }
      }
    });

    it('should exclude occupied positions', () => {
      engine.makeMoveAt({ row: 0, col: 0 });
      engine.makeMoveAt({ row: 1, col: 1 });

      const moves = engine.getAvailableMoves();
      expect(moves).toHaveLength(7);
      expect(moves).not.toContainEqual({ row: 0, col: 0 });
      expect(moves).not.toContainEqual({ row: 1, col: 1 });
    });
  });

  describe('getMoveAnalysis', () => {
    it('should return analysis for all available moves', () => {
      const analysis = engine.getMoveAnalysis();
      expect(analysis).toHaveLength(9);

      analysis.forEach((move) => {
        expect(move).toHaveProperty('position');
        expect(move).toHaveProperty('gridPosition');
        expect(move).toHaveProperty('winInTurns');
        expect(move).toHaveProperty('blocksOpponentWin');
        expect(move).toHaveProperty('createsFork');
        expect(move).toHaveProperty('blocksOpponentFork');
      });
    });

    it('should identify winning moves', () => {
      // Set up a winning scenario
      engine.makeMoveAt({ row: 0, col: 0 }); // X
      engine.makeMoveAt({ row: 1, col: 0 }); // O
      engine.makeMoveAt({ row: 0, col: 1 }); // X
      engine.makeMoveAt({ row: 1, col: 1 }); // O
      // X can win at (0, 2)

      const analysis = engine.getMoveAnalysis();
      const winningMove = analysis.find(
        (move) => move.position.row === 0 && move.position.col === 2
      );

      expect(winningMove?.winInTurns).toBe(1);
    });
  });

  describe('getBestMoves', () => {
    it('should return moves sorted by priority', () => {
      const bestMoves = engine.getBestMoves();
      expect(bestMoves).toHaveLength(9);

      // All moves should be analyzed
      bestMoves.forEach((move) => {
        expect(move).toHaveProperty('position');
        expect(move).toHaveProperty('gridPosition');
      });
    });

    it('should prioritize winning moves', () => {
      // Set up a winning scenario
      engine.makeMoveAt({ row: 0, col: 0 }); // X
      engine.makeMoveAt({ row: 1, col: 0 }); // O
      engine.makeMoveAt({ row: 0, col: 1 }); // X
      engine.makeMoveAt({ row: 1, col: 1 }); // O
      // X can win at (0, 2)

      const bestMoves = engine.getBestMoves();
      expect(bestMoves[0].position).toEqual({ row: 0, col: 2 });
      expect(bestMoves[0].winInTurns).toBe(1);
    });
  });

  describe('isGameOver', () => {
    it('should return false for ongoing game', () => {
      expect(engine.isGameOver()).toBe(false);

      engine.makeMoveAt({ row: 0, col: 0 });
      expect(engine.isGameOver()).toBe(false);
    });

    it('should return true when game is won', () => {
      // Create winning scenario
      engine.makeMoveAt({ row: 0, col: 0 }); // X
      engine.makeMoveAt({ row: 1, col: 0 }); // O
      engine.makeMoveAt({ row: 0, col: 1 }); // X
      engine.makeMoveAt({ row: 1, col: 1 }); // O
      engine.makeMoveAt({ row: 0, col: 2 }); // X wins

      expect(engine.isGameOver()).toBe(true);
    });

    it('should return true for draw games', () => {
      // Create draw scenario
      const moves = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 0, col: 2 }, // X
        { row: 1, col: 0 }, // O
        { row: 1, col: 1 }, // X
        { row: 2, col: 0 }, // O
        { row: 1, col: 2 }, // X
        { row: 2, col: 2 }, // O
        { row: 2, col: 1 }, // X - draw
      ];

      moves.forEach((position) => {
        engine.makeMoveAt(position);
      });

      expect(engine.isGameOver()).toBe(true);
    });
  });

  describe('getWinner', () => {
    it('should return null for ongoing game', () => {
      expect(engine.getWinner()).toBe(null);

      engine.makeMoveAt({ row: 0, col: 0 });
      expect(engine.getWinner()).toBe(null);
    });

    it('should return winner when game is won', () => {
      // X wins
      engine.makeMoveAt({ row: 0, col: 0 }); // X
      engine.makeMoveAt({ row: 1, col: 0 }); // O
      engine.makeMoveAt({ row: 0, col: 1 }); // X
      engine.makeMoveAt({ row: 1, col: 1 }); // O
      engine.makeMoveAt({ row: 0, col: 2 }); // X wins

      expect(engine.getWinner()).toBe('X');
    });

    it('should return null for draw games', () => {
      // Create draw scenario
      const moves = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 0, col: 2 }, // X
        { row: 1, col: 0 }, // O
        { row: 1, col: 1 }, // X
        { row: 2, col: 0 }, // O
        { row: 1, col: 2 }, // X
        { row: 2, col: 2 }, // O
        { row: 2, col: 1 }, // X - draw
      ];

      moves.forEach((position) => {
        engine.makeMoveAt(position);
      });

      expect(engine.getWinner()).toBe(null);
    });
  });

  describe('reset', () => {
    it('should reset game to initial state', () => {
      // Make some moves
      engine.makeMoveAt({ row: 0, col: 0 });
      engine.makeMoveAt({ row: 1, col: 1 });
      engine.makeMoveAt({ row: 0, col: 1 });

      engine.reset();

      const state = engine.getGameState();
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.winner).toBe(null);
      expect(state.moves).toHaveLength(0);
      expect(state.turnNumber).toBe(0);

      // Board should be empty
      state.board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBe(null);
        });
      });
    });

    it('should allow new game after reset', () => {
      // Play a complete game
      engine.makeMoveAt({ row: 0, col: 0 }); // X
      engine.makeMoveAt({ row: 1, col: 0 }); // O
      engine.makeMoveAt({ row: 0, col: 1 }); // X
      engine.makeMoveAt({ row: 1, col: 1 }); // O
      engine.makeMoveAt({ row: 0, col: 2 }); // X wins

      expect(engine.isGameOver()).toBe(true);

      engine.reset();

      const result = engine.makeMoveAt({ row: 2, col: 2 });
      expect(result).toBe(true);
      expect(engine.isGameOver()).toBe(false);
    });
  });

  describe('getHistory', () => {
    it('should return empty string for new game', () => {
      expect(engine.getHistory()).toBe('');
    });

    it('should format move history correctly', () => {
      engine.makeMoveAt({ row: 0, col: 0 }); // A1
      engine.makeMoveAt({ row: 1, col: 2 }); // C2
      engine.makeMoveAt({ row: 2, col: 1 }); // B3

      const history = engine.getHistory();
      expect(history).toBe('X: A1, O: C2, X: B3');
    });
  });

  describe('static factory methods', () => {
    describe('createHumanVsHuman', () => {
      it('should create engine with two human players', () => {
        const humanEngine = GameEngine.createHumanVsHuman();
        expect(humanEngine).toBeInstanceOf(GameEngine);

        const state = humanEngine.getGameState();
        expect(state.currentPlayer).toBe('X');
        expect(state.status).toBe('playing');
      });

      it('should allow manual moves', () => {
        const humanEngine = GameEngine.createHumanVsHuman();

        const result = humanEngine.makeMoveAt({ row: 1, col: 1 });
        expect(result).toBe(true);

        const state = humanEngine.getGameState();
        expect(state.board[1][1]).toBe('X');
      });
    });

    describe('createHumanVsRandomAI', () => {
      it('should create engine with human and random AI', () => {
        const engine = GameEngine.createHumanVsRandomAI();
        expect(engine).toBeInstanceOf(GameEngine);

        const state = engine.getGameState();
        expect(state.currentPlayer).toBe('X');
      });

      it('should allow human moves and AI moves', async () => {
        const engine = GameEngine.createHumanVsRandomAI();

        // Human move
        engine.makeMoveAt({ row: 0, col: 0 });
        expect(engine.getGameState().board[0][0]).toBe('X');

        // AI (O) should be able to make a move
        const result = await engine.makeMove();
        expect(result).toBe(true);

        const state = engine.getGameState();
        expect(state.currentPlayer).toBe('X'); // Should be back to human's turn

        // Now if we try makeMove() again, it should fail because human needs UI
        await expect(engine.makeMove()).rejects.toThrow(
          'Human player requires UI implementation'
        );
      });
    });

    describe('createHumanVsStrategicAI', () => {
      it('should create engine with human and strategic AI', () => {
        const engine = GameEngine.createHumanVsStrategicAI();
        expect(engine).toBeInstanceOf(GameEngine);
      });
    });

    describe('createRandomAIVsStrategicAI', () => {
      it('should create engine with two AI players', () => {
        const engine = GameEngine.createRandomAIVsStrategicAI();
        expect(engine).toBeInstanceOf(GameEngine);
      });

      it('should allow AI vs AI gameplay', async () => {
        const engine = GameEngine.createRandomAIVsStrategicAI();

        // Both AIs should be able to make moves
        const result1 = await engine.makeMove(); // Random AI (X)
        expect(result1).toBe(true);

        const state = engine.getGameState();
        expect(state.currentPlayer).toBe('O');

        const result2 = await engine.makeMove(); // Strategic AI (O)
        expect(result2).toBe(true);
      });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete AI vs AI game', async () => {
      const aiEngine = GameEngine.createRandomAIVsStrategicAI();

      // Play until game is over
      let moves = 0;
      while (!aiEngine.isGameOver() && moves < 9) {
        const result = await aiEngine.makeMove();
        expect(result).toBe(true);
        moves++;
      }

      expect(aiEngine.isGameOver()).toBe(true);
      expect(moves).toBeLessThanOrEqual(9);
    });

    it('should maintain state consistency throughout game', async () => {
      playerX.setMockMoves([
        { row: 1, col: 1 }, // X center
        { row: 0, col: 1 }, // X
        { row: 2, col: 1 }, // X wins
      ]);
      playerO.setMockMoves([
        { row: 0, col: 0 }, // O corner
        { row: 2, col: 2 }, // O
      ]);

      const moves = [
        { expectedPlayer: 'X', expectedTurn: 1 },
        { expectedPlayer: 'O', expectedTurn: 2 },
        { expectedPlayer: 'X', expectedTurn: 3 },
        { expectedPlayer: 'O', expectedTurn: 4 },
        { expectedPlayer: 'X', expectedTurn: 5 },
      ];

      for (let i = 0; i < moves.length; i++) {
        const stateBefore = engine.getGameState();
        const result = await engine.makeMove();
        const stateAfter = engine.getGameState();

        if (result && stateAfter.status === 'playing') {
          expect(stateAfter.turnNumber).toBe(stateBefore.turnNumber + 1);
          expect(stateAfter.moves).toHaveLength(stateBefore.moves.length + 1);
        }

        if (stateAfter.status !== 'playing') {
          break; // Game ended
        }
      }
    });
  });
});
