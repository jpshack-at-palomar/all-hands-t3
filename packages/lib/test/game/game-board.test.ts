import { describe, it, expect, beforeEach } from 'vitest';
import { GameBoard } from '../../src/game/game-board.js';
import type { Position, GridPosition } from '../../src/types/game.js';

describe('GameBoard', () => {
  let board: GameBoard;

  beforeEach(() => {
    board = new GameBoard();
  });

  describe('constructor', () => {
    it('should create an empty 3x3 board', () => {
      const boardState = board.getBoard();
      expect(boardState).toHaveLength(3);
      expect(boardState[0]).toHaveLength(3);
      expect(boardState[1]).toHaveLength(3);
      expect(boardState[2]).toHaveLength(3);
      
      // Check all cells are null
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(boardState[row][col]).toBe(null);
        }
      }
    });
  });

  describe('getCell', () => {
    it('should return null for empty positions', () => {
      const position: Position = { row: 0, col: 0 };
      expect(board.getCell(position)).toBe(null);
    });

    it('should return the correct value for occupied positions', () => {
      const position: Position = { row: 1, col: 1 };
      board.setCell(position, 'X');
      expect(board.getCell(position)).toBe('X');
    });

    it('should handle all board positions', () => {
      // Test all 9 positions
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const position: Position = { row, col };
          expect(board.getCell(position)).toBe(null);
        }
      }
    });
  });

  describe('setCell', () => {
    it('should set a cell value correctly', () => {
      const position: Position = { row: 0, col: 0 };
      board.setCell(position, 'X');
      expect(board.getCell(position)).toBe('X');
    });

    it('should overwrite existing values', () => {
      const position: Position = { row: 1, col: 2 };
      board.setCell(position, 'X');
      expect(board.getCell(position)).toBe('X');
      
      board.setCell(position, 'O');
      expect(board.getCell(position)).toBe('O');
    });

    it('should set null values', () => {
      const position: Position = { row: 2, col: 1 };
      board.setCell(position, 'X');
      board.setCell(position, null);
      expect(board.getCell(position)).toBe(null);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty positions', () => {
      const position: Position = { row: 0, col: 0 };
      expect(board.isEmpty(position)).toBe(true);
    });

    it('should return false for occupied positions', () => {
      const position: Position = { row: 0, col: 0 };
      board.setCell(position, 'X');
      expect(board.isEmpty(position)).toBe(false);
    });

    it('should return true after clearing a position', () => {
      const position: Position = { row: 1, col: 1 };
      board.setCell(position, 'O');
      board.setCell(position, null);
      expect(board.isEmpty(position)).toBe(true);
    });
  });

  describe('getEmptyPositions', () => {
    it('should return all positions for empty board', () => {
      const emptyPositions = board.getEmptyPositions();
      expect(emptyPositions).toHaveLength(9);
      
      // Check that all positions are included
      const expectedPositions = [];
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expectedPositions.push({ row, col });
        }
      }
      expect(emptyPositions).toEqual(expectedPositions);
    });

    it('should return correct positions after some moves', () => {
      board.setCell({ row: 0, col: 0 }, 'X');
      board.setCell({ row: 1, col: 1 }, 'O');
      board.setCell({ row: 2, col: 2 }, 'X');
      
      const emptyPositions = board.getEmptyPositions();
      expect(emptyPositions).toHaveLength(6);
      
      // Check that occupied positions are not included
      expect(emptyPositions).not.toContainEqual({ row: 0, col: 0 });
      expect(emptyPositions).not.toContainEqual({ row: 1, col: 1 });
      expect(emptyPositions).not.toContainEqual({ row: 2, col: 2 });
    });

    it('should return empty array for full board', () => {
      // Fill the board
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board.setCell({ row, col }, row % 2 === 0 ? 'X' : 'O');
        }
      }
      
      const emptyPositions = board.getEmptyPositions();
      expect(emptyPositions).toHaveLength(0);
    });
  });

  describe('isFull', () => {
    it('should return false for empty board', () => {
      expect(board.isFull()).toBe(false);
    });

    it('should return false for partially filled board', () => {
      board.setCell({ row: 0, col: 0 }, 'X');
      board.setCell({ row: 1, col: 1 }, 'O');
      expect(board.isFull()).toBe(false);
    });

    it('should return true for full board', () => {
      // Fill the board
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board.setCell({ row, col }, row % 2 === 0 ? 'X' : 'O');
        }
      }
      expect(board.isFull()).toBe(true);
    });
  });

  describe('getBoard', () => {
    it('should return a copy of the board state', () => {
      const boardState = board.getBoard();
      
      // Modify the returned array
      boardState[0][0] = 'X';
      
      // Original board should not be affected
      expect(board.getCell({ row: 0, col: 0 })).toBe(null);
    });

    it('should return current board state', () => {
      board.setCell({ row: 0, col: 0 }, 'X');
      board.setCell({ row: 1, col: 1 }, 'O');
      
      const boardState = board.getBoard();
      expect(boardState[0][0]).toBe('X');
      expect(boardState[1][1]).toBe('O');
      expect(boardState[2][2]).toBe(null);
    });
  });

  describe('reset', () => {
    it('should clear all positions', () => {
      // Fill some positions
      board.setCell({ row: 0, col: 0 }, 'X');
      board.setCell({ row: 1, col: 1 }, 'O');
      board.setCell({ row: 2, col: 2 }, 'X');
      
      board.reset();
      
      // Check all positions are empty
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(board.getCell({ row, col })).toBe(null);
        }
      }
    });

    it('should make board not full after reset', () => {
      // Fill the board
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board.setCell({ row, col }, 'X');
        }
      }
      expect(board.isFull()).toBe(true);
      
      board.reset();
      expect(board.isFull()).toBe(false);
      expect(board.getEmptyPositions()).toHaveLength(9);
    });
  });

  describe('positionToGrid', () => {
    it('should convert position to grid coordinates correctly', () => {
      const testCases = [
        { position: { row: 0, col: 0 }, expected: { letter: 'A', number: 1 } },
        { position: { row: 0, col: 1 }, expected: { letter: 'B', number: 1 } },
        { position: { row: 0, col: 2 }, expected: { letter: 'C', number: 1 } },
        { position: { row: 1, col: 0 }, expected: { letter: 'A', number: 2 } },
        { position: { row: 1, col: 1 }, expected: { letter: 'B', number: 2 } },
        { position: { row: 1, col: 2 }, expected: { letter: 'C', number: 2 } },
        { position: { row: 2, col: 0 }, expected: { letter: 'A', number: 3 } },
        { position: { row: 2, col: 1 }, expected: { letter: 'B', number: 3 } },
        { position: { row: 2, col: 2 }, expected: { letter: 'C', number: 3 } },
      ];

      testCases.forEach(({ position, expected }) => {
        const result = board.positionToGrid(position);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('gridToPosition', () => {
    it('should convert grid coordinates to position correctly', () => {
      const testCases = [
        { grid: { letter: 'A', number: 1 }, expected: { row: 0, col: 0 } },
        { grid: { letter: 'B', number: 1 }, expected: { row: 0, col: 1 } },
        { grid: { letter: 'C', number: 1 }, expected: { row: 0, col: 2 } },
        { grid: { letter: 'A', number: 2 }, expected: { row: 1, col: 0 } },
        { grid: { letter: 'B', number: 2 }, expected: { row: 1, col: 1 } },
        { grid: { letter: 'C', number: 2 }, expected: { row: 1, col: 2 } },
        { grid: { letter: 'A', number: 3 }, expected: { row: 2, col: 0 } },
        { grid: { letter: 'B', number: 3 }, expected: { row: 2, col: 1 } },
        { grid: { letter: 'C', number: 3 }, expected: { row: 2, col: 2 } },
      ];

      testCases.forEach(({ grid, expected }) => {
        const result = board.gridToPosition(grid);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('isValidGridPosition', () => {
    it('should return true for valid grid positions', () => {
      const validPositions: GridPosition[] = [
        { letter: 'A', number: 1 },
        { letter: 'B', number: 2 },
        { letter: 'C', number: 3 },
        { letter: 'A', number: 3 },
        { letter: 'C', number: 1 },
      ];

      validPositions.forEach((pos) => {
        expect(board.isValidGridPosition(pos)).toBe(true);
      });
    });

    it('should return false for invalid grid positions', () => {
      const invalidPositions: GridPosition[] = [
        { letter: 'D', number: 1 }, // Invalid letter
        { letter: 'A', number: 0 }, // Invalid number (too low)
        { letter: 'B', number: 4 }, // Invalid number (too high)
        { letter: 'Z', number: 2 }, // Invalid letter
        { letter: 'a', number: 1 }, // Lowercase letter
      ];

      invalidPositions.forEach((pos) => {
        expect(board.isValidGridPosition(pos)).toBe(false);
      });
    });
  });

  describe('coordinate conversion roundtrip', () => {
    it('should maintain consistency between position and grid conversions', () => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          const position: Position = { row, col };
          const grid = board.positionToGrid(position);
          const convertedBack = board.gridToPosition(grid);
          
          expect(convertedBack).toEqual(position);
          expect(board.isValidGridPosition(grid)).toBe(true);
        }
      }
    });
  });
});