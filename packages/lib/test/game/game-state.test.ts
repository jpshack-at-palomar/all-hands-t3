import { describe, it, expect, beforeEach } from 'vitest';
import { GameState } from '../../src/game/game-state.js';
import type { Position } from '../../src/types/game.js';

describe('GameState', () => {
  let gameState: GameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('constructor', () => {
    it('should initialize with empty board and X as first player', () => {
      const state = gameState.getState();

      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.winner).toBe(null);
      expect(state.moves).toHaveLength(0);
      expect(state.turnNumber).toBe(0);

      // Check board is empty
      state.board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toBe(null);
        });
      });
    });
  });

  describe('getState', () => {
    it('should return a copy of the state', () => {
      const state1 = gameState.getState();
      const state2 = gameState.getState();

      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2); // Different objects

      // Modifying returned state should not affect internal state
      state1.currentPlayer = 'O';
      expect(gameState.getState().currentPlayer).toBe('X');
    });
  });

  describe('makeMove', () => {
    it('should make valid moves successfully', () => {
      const position: Position = { row: 0, col: 0 };
      const result = gameState.makeMove(position);

      expect(result).toBe(true);

      const state = gameState.getState();
      expect(state.board[0][0]).toBe('X');
      expect(state.currentPlayer).toBe('O');
      expect(state.turnNumber).toBe(1);
      expect(state.moves).toHaveLength(1);
      expect(state.moves[0].player).toBe('X');
      expect(state.moves[0].position).toEqual(position);
      expect(state.moves[0].gridPosition).toEqual({ letter: 'A', number: 1 });
    });

    it('should reject moves to occupied positions', () => {
      const position: Position = { row: 0, col: 0 };

      // Make first move
      expect(gameState.makeMove(position)).toBe(true);

      // Try to make move to same position
      expect(gameState.makeMove(position)).toBe(false);

      // State should not change
      const state = gameState.getState();
      expect(state.currentPlayer).toBe('O');
      expect(state.turnNumber).toBe(1);
      expect(state.moves).toHaveLength(1);
    });

    it('should alternate players correctly', () => {
      const moves = [
        { row: 0, col: 0 }, // X
        { row: 0, col: 1 }, // O
        { row: 0, col: 2 }, // X
        { row: 1, col: 0 }, // O
      ];

      moves.forEach((position, index) => {
        const expectedPlayer = index % 2 === 0 ? 'X' : 'O';
        const stateBefore = gameState.getState();
        expect(stateBefore.currentPlayer).toBe(expectedPlayer);

        expect(gameState.makeMove(position)).toBe(true);

        const stateAfter = gameState.getState();
        expect(stateAfter.board[position.row][position.col]).toBe(
          expectedPlayer
        );
        expect(stateAfter.turnNumber).toBe(index + 1);
      });
    });

    it('should reject moves when game is over', () => {
      // Create winning scenario for X
      gameState.makeMove({ row: 0, col: 0 }); // X
      gameState.makeMove({ row: 1, col: 0 }); // O
      gameState.makeMove({ row: 0, col: 1 }); // X
      gameState.makeMove({ row: 1, col: 1 }); // O
      gameState.makeMove({ row: 0, col: 2 }); // X wins

      const state = gameState.getState();
      expect(state.status).toBe('won');
      expect(state.winner).toBe('X');

      // Try to make another move
      const result = gameState.makeMove({ row: 2, col: 0 });
      expect(result).toBe(false);
    });

    it('should include timestamp in moves', () => {
      const timeBefore = Date.now();

      gameState.makeMove({ row: 0, col: 0 });

      const timeAfter = Date.now();
      const state = gameState.getState();
      const move = state.moves[0];

      expect(move.timestamp).toBeGreaterThanOrEqual(timeBefore);
      expect(move.timestamp).toBeLessThanOrEqual(timeAfter);
    });
  });

  describe('win detection', () => {
    it('should detect horizontal wins', () => {
      // X wins top row
      gameState.makeMove({ row: 0, col: 0 }); // X
      gameState.makeMove({ row: 1, col: 0 }); // O
      gameState.makeMove({ row: 0, col: 1 }); // X
      gameState.makeMove({ row: 1, col: 1 }); // O
      gameState.makeMove({ row: 0, col: 2 }); // X wins

      const state = gameState.getState();
      expect(state.status).toBe('won');
      expect(state.winner).toBe('X');
    });

    it('should detect vertical wins', () => {
      // O wins left column
      gameState.makeMove({ row: 1, col: 1 }); // X
      gameState.makeMove({ row: 0, col: 0 }); // O
      gameState.makeMove({ row: 0, col: 1 }); // X
      gameState.makeMove({ row: 1, col: 0 }); // O
      gameState.makeMove({ row: 0, col: 2 }); // X
      gameState.makeMove({ row: 2, col: 0 }); // O wins

      const state = gameState.getState();
      expect(state.status).toBe('won');
      expect(state.winner).toBe('O');
    });

    it('should detect diagonal wins', () => {
      // X wins main diagonal
      gameState.makeMove({ row: 0, col: 0 }); // X
      gameState.makeMove({ row: 0, col: 1 }); // O
      gameState.makeMove({ row: 1, col: 1 }); // X
      gameState.makeMove({ row: 0, col: 2 }); // O
      gameState.makeMove({ row: 2, col: 2 }); // X wins

      const state = gameState.getState();
      expect(state.status).toBe('won');
      expect(state.winner).toBe('X');
    });

    it('should detect draw games', () => {
      // Create a draw scenario
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
        gameState.makeMove(position);
      });

      const state = gameState.getState();
      expect(state.status).toBe('draw');
      expect(state.winner).toBe(null);
    });
  });

  describe('getAvailableMoves', () => {
    it('should return all positions for empty board', () => {
      const moves = gameState.getAvailableMoves();
      expect(moves).toHaveLength(9);

      // Check all positions are included
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(moves).toContainEqual({ row, col });
        }
      }
    });

    it('should exclude occupied positions', () => {
      gameState.makeMove({ row: 0, col: 0 });
      gameState.makeMove({ row: 1, col: 1 });

      const moves = gameState.getAvailableMoves();
      expect(moves).toHaveLength(7);
      expect(moves).not.toContainEqual({ row: 0, col: 0 });
      expect(moves).not.toContainEqual({ row: 1, col: 1 });
    });

    it('should return empty array for full board', () => {
      // Create a draw scenario to fill the board completely
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
        gameState.makeMove(position);
      });

      const availableMoves = gameState.getAvailableMoves();
      expect(availableMoves).toHaveLength(0);
    });
  });

  describe('getMoveAnalysis', () => {
    it('should analyze all available moves', () => {
      const analysis = gameState.getMoveAnalysis();
      expect(analysis).toHaveLength(9); // Empty board

      analysis.forEach((move) => {
        expect(move.position).toBeDefined();
        expect(move.gridPosition).toBeDefined();
        expect(
          move.winInTurns === null || typeof move.winInTurns === 'number'
        ).toBe(true);
        expect(typeof move.blocksOpponentWin).toBe('boolean');
        expect(typeof move.createsFork).toBe('boolean');
        expect(typeof move.blocksOpponentFork).toBe('boolean');
      });
    });

    it('should identify winning moves', () => {
      // Set up a winning scenario
      gameState.makeMove({ row: 0, col: 0 }); // X
      gameState.makeMove({ row: 1, col: 0 }); // O
      gameState.makeMove({ row: 0, col: 1 }); // X
      gameState.makeMove({ row: 1, col: 1 }); // O
      // X can win at (0, 2)

      const analysis = gameState.getMoveAnalysis();
      const winningMove = analysis.find(
        (move) => move.position.row === 0 && move.position.col === 2
      );

      expect(winningMove?.winInTurns).toBe(1);
    });
  });

  describe('getBestMoves', () => {
    it('should sort moves by priority', () => {
      // Set up a scenario with winning and blocking moves
      gameState.makeMove({ row: 0, col: 0 }); // X
      gameState.makeMove({ row: 1, col: 0 }); // O
      gameState.makeMove({ row: 0, col: 1 }); // X
      gameState.makeMove({ row: 1, col: 1 }); // O
      // X can win at (0, 2), this should be the best move

      const bestMoves = gameState.getBestMoves();
      expect(bestMoves).toHaveLength(5); // 5 available moves (9 - 4 made)

      // First move should be the winning move
      expect(bestMoves[0].position).toEqual({ row: 0, col: 2 });
      expect(bestMoves[0].winInTurns).toBe(1);
    });

    it('should handle empty board', () => {
      const bestMoves = gameState.getBestMoves();
      expect(bestMoves).toHaveLength(9);

      // All moves should be analyzed
      bestMoves.forEach((move) => {
        expect(move.position).toBeDefined();
        expect(move.gridPosition).toBeDefined();
      });
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      // Make some moves
      gameState.makeMove({ row: 0, col: 0 });
      gameState.makeMove({ row: 1, col: 1 });
      gameState.makeMove({ row: 0, col: 1 });

      // Reset
      gameState.reset();

      const state = gameState.getState();
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
      const moves = [
        { row: 0, col: 0 }, // X
        { row: 1, col: 0 }, // O
        { row: 0, col: 1 }, // X
        { row: 1, col: 1 }, // O
        { row: 0, col: 2 }, // X wins
      ];

      moves.forEach((position) => {
        gameState.makeMove(position);
      });

      expect(gameState.getState().status).toBe('won');

      // Reset and start new game
      gameState.reset();

      const result = gameState.makeMove({ row: 1, col: 1 });
      expect(result).toBe(true);

      const state = gameState.getState();
      expect(state.board[1][1]).toBe('X');
      expect(state.currentPlayer).toBe('O');
    });
  });

  describe('getHistory', () => {
    it('should return empty string for no moves', () => {
      expect(gameState.getHistory()).toBe('');
    });

    it('should format moves correctly', () => {
      gameState.makeMove({ row: 0, col: 0 }); // A1
      gameState.makeMove({ row: 1, col: 2 }); // C2
      gameState.makeMove({ row: 2, col: 1 }); // B3

      const history = gameState.getHistory();
      expect(history).toBe('X: A1, O: C2, X: B3');
    });

    it('should handle complete game history', () => {
      const moves = [
        { row: 0, col: 0 }, // X: A1
        { row: 0, col: 1 }, // O: B1
        { row: 1, col: 1 }, // X: B2
        { row: 0, col: 2 }, // O: C1
        { row: 2, col: 2 }, // X: C3
      ];

      moves.forEach((position) => {
        gameState.makeMove(position);
      });

      const history = gameState.getHistory();
      expect(history).toBe('X: A1, O: B1, X: B2, O: C1, X: C3');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete game flow', () => {
      // Start game
      expect(gameState.getState().status).toBe('playing');
      expect(gameState.getAvailableMoves()).toHaveLength(9);

      // Make moves
      gameState.makeMove({ row: 1, col: 1 }); // X center
      expect(gameState.getState().currentPlayer).toBe('O');

      gameState.makeMove({ row: 0, col: 0 }); // O corner
      expect(gameState.getState().currentPlayer).toBe('X');

      // Continue until win
      gameState.makeMove({ row: 0, col: 1 }); // X
      gameState.makeMove({ row: 2, col: 2 }); // O
      gameState.makeMove({ row: 2, col: 1 }); // X wins

      const finalState = gameState.getState();
      expect(finalState.status).toBe('won');
      expect(finalState.winner).toBe('X');
      expect(finalState.turnNumber).toBe(5);
      expect(gameState.getAvailableMoves()).toHaveLength(4); // Still have empty positions but game is over
    });

    it('should maintain state consistency throughout game', () => {
      // Test first move
      let stateBefore = gameState.getState();
      let moveResult = gameState.makeMove({ row: 1, col: 1 }); // X center
      let stateAfter = gameState.getState();

      expect(moveResult).toBe(true);
      expect(stateAfter.turnNumber).toBe(stateBefore.turnNumber + 1);
      expect(stateAfter.moves).toHaveLength(stateBefore.moves.length + 1);
      expect(stateAfter.board[1][1]).toBe('X');

      // Test second move
      stateBefore = gameState.getState();
      moveResult = gameState.makeMove({ row: 0, col: 0 }); // O corner
      stateAfter = gameState.getState();

      expect(moveResult).toBe(true);
      expect(stateAfter.turnNumber).toBe(stateBefore.turnNumber + 1);
      expect(stateAfter.moves).toHaveLength(stateBefore.moves.length + 1);
      expect(stateAfter.board[0][0]).toBe('O');

      // Test third move
      stateBefore = gameState.getState();
      moveResult = gameState.makeMove({ row: 0, col: 1 }); // X
      stateAfter = gameState.getState();

      expect(moveResult).toBe(true);
      expect(stateAfter.turnNumber).toBe(stateBefore.turnNumber + 1);
      expect(stateAfter.moves).toHaveLength(stateBefore.moves.length + 1);
      expect(stateAfter.board[0][1]).toBe('X');
    });
  });
});
