import type { Position, GridPosition } from '../types/game.js';

export class CoordinateSystem {
  private static readonly LETTERS = ['A', 'B', 'C'];
  private static readonly NUMBERS = [1, 2, 3];

  /**
   * Convert position to grid coordinates
   */
  static positionToGrid(position: Position): GridPosition {
    return {
      letter: this.LETTERS[position.col],
      number: position.row + 1,
    };
  }

  /**
   * Convert grid coordinates to position
   */
  static gridToPosition(grid: GridPosition): Position {
    return {
      row: grid.number - 1,
      col: this.LETTERS.indexOf(grid.letter),
    };
  }

  /**
   * Validate grid coordinates
   */
  static isValidGridPosition(grid: GridPosition): boolean {
    return (
      this.LETTERS.includes(grid.letter) && this.NUMBERS.includes(grid.number)
    );
  }

  /**
   * Parse grid coordinate string (e.g., "A1", "B2")
   */
  static parseGridString(gridString: string): GridPosition | null {
    const match = gridString.toUpperCase().match(/^([ABC])([123])$/);
    if (!match) {
      return null;
    }
    return {
      letter: match[1],
      number: parseInt(match[2]),
    };
  }

  /**
   * Format position as grid string
   */
  static formatPosition(position: Position): string {
    const grid = this.positionToGrid(position);
    return `${grid.letter}${grid.number}`;
  }

  /**
   * Get all valid grid positions
   */
  static getAllGridPositions(): GridPosition[] {
    const positions: GridPosition[] = [];
    for (const letter of this.LETTERS) {
      for (const number of this.NUMBERS) {
        positions.push({ letter, number });
      }
    }
    return positions;
  }
}
