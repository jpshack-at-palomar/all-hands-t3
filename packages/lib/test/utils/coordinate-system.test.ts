import { describe, it, expect } from 'vitest';
import { CoordinateSystem } from '../../src/utils/coordinate-system.js';
import type { Position, GridPosition } from '../../src/types/game.js';

describe('CoordinateSystem', () => {
  describe('positionToGrid', () => {
    it('should convert top-left position to A1', () => {
      const position: Position = { row: 0, col: 0 };
      const grid = CoordinateSystem.positionToGrid(position);

      expect(grid).toEqual({ letter: 'A', number: 1 });
    });

    it('should convert center position to B2', () => {
      const position: Position = { row: 1, col: 1 };
      const grid = CoordinateSystem.positionToGrid(position);

      expect(grid).toEqual({ letter: 'B', number: 2 });
    });

    it('should convert bottom-right position to C3', () => {
      const position: Position = { row: 2, col: 2 };
      const grid = CoordinateSystem.positionToGrid(position);

      expect(grid).toEqual({ letter: 'C', number: 3 });
    });

    it('should convert all valid positions correctly', () => {
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
        const result = CoordinateSystem.positionToGrid(position);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('gridToPosition', () => {
    it('should convert A1 to top-left position', () => {
      const grid: GridPosition = { letter: 'A', number: 1 };
      const position = CoordinateSystem.gridToPosition(grid);

      expect(position).toEqual({ row: 0, col: 0 });
    });

    it('should convert B2 to center position', () => {
      const grid: GridPosition = { letter: 'B', number: 2 };
      const position = CoordinateSystem.gridToPosition(grid);

      expect(position).toEqual({ row: 1, col: 1 });
    });

    it('should convert C3 to bottom-right position', () => {
      const grid: GridPosition = { letter: 'C', number: 3 };
      const position = CoordinateSystem.gridToPosition(grid);

      expect(position).toEqual({ row: 2, col: 2 });
    });

    it('should convert all valid grid coordinates correctly', () => {
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
        const result = CoordinateSystem.gridToPosition(grid);
        expect(result).toEqual(expected);
      });
    });
  });

  describe('round-trip conversions', () => {
    it('should maintain consistency between position and grid conversions', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ];

      positions.forEach((originalPosition) => {
        const grid = CoordinateSystem.positionToGrid(originalPosition);
        const backToPosition = CoordinateSystem.gridToPosition(grid);
        expect(backToPosition).toEqual(originalPosition);
      });
    });

    it('should maintain consistency between grid and position conversions', () => {
      const grids: GridPosition[] = [
        { letter: 'A', number: 1 },
        { letter: 'B', number: 1 },
        { letter: 'C', number: 1 },
        { letter: 'A', number: 2 },
        { letter: 'B', number: 2 },
        { letter: 'C', number: 2 },
        { letter: 'A', number: 3 },
        { letter: 'B', number: 3 },
        { letter: 'C', number: 3 },
      ];

      grids.forEach((originalGrid) => {
        const position = CoordinateSystem.gridToPosition(originalGrid);
        const backToGrid = CoordinateSystem.positionToGrid(position);
        expect(backToGrid).toEqual(originalGrid);
      });
    });
  });

  describe('isValidGridPosition', () => {
    it('should validate correct grid positions', () => {
      const validGrids = [
        { letter: 'A', number: 1 },
        { letter: 'B', number: 2 },
        { letter: 'C', number: 3 },
      ];

      validGrids.forEach((grid) => {
        expect(CoordinateSystem.isValidGridPosition(grid)).toBe(true);
      });
    });

    it('should reject invalid letters', () => {
      const invalidGrids = [
        { letter: 'D', number: 1 },
        { letter: 'X', number: 2 },
        { letter: 'Z', number: 3 },
        { letter: 'a', number: 1 }, // lowercase
      ];

      invalidGrids.forEach((grid) => {
        expect(CoordinateSystem.isValidGridPosition(grid)).toBe(false);
      });
    });

    it('should reject invalid numbers', () => {
      const invalidGrids = [
        { letter: 'A', number: 0 },
        { letter: 'B', number: 4 },
        { letter: 'C', number: -1 },
        { letter: 'A', number: 10 },
      ];

      invalidGrids.forEach((grid) => {
        expect(CoordinateSystem.isValidGridPosition(grid)).toBe(false);
      });
    });

    it('should validate all valid grid positions', () => {
      for (const letter of ['A', 'B', 'C']) {
        for (const number of [1, 2, 3]) {
          expect(CoordinateSystem.isValidGridPosition({ letter, number })).toBe(
            true
          );
        }
      }
    });
  });

  describe('parseGridString', () => {
    it('should parse valid grid strings', () => {
      const testCases = [
        { input: 'A1', expected: { letter: 'A', number: 1 } },
        { input: 'B2', expected: { letter: 'B', number: 2 } },
        { input: 'C3', expected: { letter: 'C', number: 3 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = CoordinateSystem.parseGridString(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle lowercase input', () => {
      const testCases = [
        { input: 'a1', expected: { letter: 'A', number: 1 } },
        { input: 'b2', expected: { letter: 'B', number: 2 } },
        { input: 'c3', expected: { letter: 'C', number: 3 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = CoordinateSystem.parseGridString(input);
        expect(result).toEqual(expected);
      });
    });

    it('should handle mixed case input', () => {
      const testCases = [
        { input: 'a1', expected: { letter: 'A', number: 1 } },
        { input: 'B2', expected: { letter: 'B', number: 2 } },
        { input: 'c3', expected: { letter: 'C', number: 3 } },
      ];

      testCases.forEach(({ input, expected }) => {
        const result = CoordinateSystem.parseGridString(input);
        expect(result).toEqual(expected);
      });
    });

    it('should return null for invalid grid strings', () => {
      const invalidInputs = [
        'D1', // Invalid letter
        'A4', // Invalid number
        'A0', // Invalid number
        'AA1', // Too many letters
        'A11', // Too many numbers
        '1A', // Wrong order
        'A', // Missing number
        '1', // Missing letter
        '', // Empty string
        'AB', // No number
        '12', // No letter
        'A1B', // Extra letter
        'A1A', // Extra letter
        'X5', // Both invalid
        'a1b', // Extra character
      ];

      invalidInputs.forEach((input) => {
        const result = CoordinateSystem.parseGridString(input);
        expect(result).toBeNull();
      });
    });

    it('should parse all valid grid strings', () => {
      for (const letter of ['A', 'B', 'C']) {
        for (const number of [1, 2, 3]) {
          const input = `${letter}${number}`;
          const result = CoordinateSystem.parseGridString(input);
          expect(result).toEqual({ letter, number });
        }
      }
    });
  });

  describe('formatPosition', () => {
    it('should format positions as grid strings', () => {
      const testCases = [
        { position: { row: 0, col: 0 }, expected: 'A1' },
        { position: { row: 0, col: 1 }, expected: 'B1' },
        { position: { row: 0, col: 2 }, expected: 'C1' },
        { position: { row: 1, col: 0 }, expected: 'A2' },
        { position: { row: 1, col: 1 }, expected: 'B2' },
        { position: { row: 1, col: 2 }, expected: 'C2' },
        { position: { row: 2, col: 0 }, expected: 'A3' },
        { position: { row: 2, col: 1 }, expected: 'B3' },
        { position: { row: 2, col: 2 }, expected: 'C3' },
      ];

      testCases.forEach(({ position, expected }) => {
        const result = CoordinateSystem.formatPosition(position);
        expect(result).toBe(expected);
      });
    });

    it('should be consistent with parseGridString', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ];

      positions.forEach((position) => {
        const formatted = CoordinateSystem.formatPosition(position);
        const parsed = CoordinateSystem.parseGridString(formatted);
        const backToPosition = parsed
          ? CoordinateSystem.gridToPosition(parsed)
          : null;

        expect(backToPosition).toEqual(position);
      });
    });
  });

  describe('getAllGridPositions', () => {
    it('should return all 9 valid grid positions', () => {
      const allPositions = CoordinateSystem.getAllGridPositions();
      expect(allPositions).toHaveLength(9);
    });

    it('should include all expected grid positions', () => {
      const allPositions = CoordinateSystem.getAllGridPositions();
      const expected = [
        { letter: 'A', number: 1 },
        { letter: 'A', number: 2 },
        { letter: 'A', number: 3 },
        { letter: 'B', number: 1 },
        { letter: 'B', number: 2 },
        { letter: 'B', number: 3 },
        { letter: 'C', number: 1 },
        { letter: 'C', number: 2 },
        { letter: 'C', number: 3 },
      ];

      expected.forEach((expectedPosition) => {
        expect(allPositions).toContainEqual(expectedPosition);
      });
    });

    it('should not contain duplicates', () => {
      const allPositions = CoordinateSystem.getAllGridPositions();
      const uniquePositions = Array.from(
        new Set(allPositions.map((pos) => `${pos.letter}${pos.number}`))
      );

      expect(uniquePositions).toHaveLength(allPositions.length);
    });

    it('should return positions in consistent order', () => {
      const allPositions1 = CoordinateSystem.getAllGridPositions();
      const allPositions2 = CoordinateSystem.getAllGridPositions();

      expect(allPositions1).toEqual(allPositions2);
    });

    it('should return valid grid positions only', () => {
      const allPositions = CoordinateSystem.getAllGridPositions();

      allPositions.forEach((position) => {
        expect(CoordinateSystem.isValidGridPosition(position)).toBe(true);
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle edge positions correctly', () => {
      const edgePositions = [
        { row: 0, col: 0 }, // Top-left
        { row: 0, col: 2 }, // Top-right
        { row: 2, col: 0 }, // Bottom-left
        { row: 2, col: 2 }, // Bottom-right
      ];

      edgePositions.forEach((position) => {
        const grid = CoordinateSystem.positionToGrid(position);
        expect(CoordinateSystem.isValidGridPosition(grid)).toBe(true);

        const backToPosition = CoordinateSystem.gridToPosition(grid);
        expect(backToPosition).toEqual(position);
      });
    });

    it('should handle whitespace in grid strings', () => {
      const inputs = [' A1', 'A1 ', ' A1 ', 'A 1', 'A1\t', '\nA1'];

      inputs.forEach((input) => {
        const result = CoordinateSystem.parseGridString(input);
        expect(result).toBeNull();
      });
    });
  });

  describe('integration with other systems', () => {
    it('should work correctly with game board positions', () => {
      // Test that coordinate system works with typical game board usage
      const gamePositions = [
        { row: 1, col: 1 }, // Center
        { row: 0, col: 0 }, // Corner
        { row: 2, col: 2 }, // Opposite corner
      ];

      gamePositions.forEach((position) => {
        const gridString = CoordinateSystem.formatPosition(position);
        const parsedGrid = CoordinateSystem.parseGridString(gridString);
        const backToPosition = parsedGrid
          ? CoordinateSystem.gridToPosition(parsedGrid)
          : null;

        expect(backToPosition).toEqual(position);
        expect(parsedGrid).toBeDefined();
        if (parsedGrid) {
          expect(CoordinateSystem.isValidGridPosition(parsedGrid)).toBe(true);
        }
      });
    });
  });
});
