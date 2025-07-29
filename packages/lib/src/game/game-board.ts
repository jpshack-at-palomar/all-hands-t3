import { Position, CellValue, GridPosition } from '../types/game.js';

export class GameBoard {
  private board: CellValue[][];

  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  /**
   * Get the value at a specific position
   */
  getCell(position: Position): CellValue {
    return this.board[position.row][position.col];
  }

  /**
   * Set the value at a specific position
   */
  setCell(position: Position, value: CellValue): void {
    this.board[position.row][position.col] = value;
  }

  /**
   * Check if a position is empty
   */
  isEmpty(position: Position): boolean {
    return this.getCell(position) === null;
  }

  /**
   * Get all empty positions
   */
  getEmptyPositions(): Position[] {
    const empty: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.isEmpty({ row, col })) {
          empty.push({ row, col });
        }
      }
    }
    return empty;
  }

  /**
   * Check if the board is full
   */
  isFull(): boolean {
    return this.getEmptyPositions().length === 0;
  }

  /**
   * Get a copy of the current board state
   */
  getBoard(): CellValue[][] {
    return this.board.map((row) => [...row]);
  }

  /**
   * Reset the board to empty state
   */
  reset(): void {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  /**
   * Convert position to grid coordinates
   */
  positionToGrid(position: Position): GridPosition {
    const letters = ['A', 'B', 'C'];
    return {
      letter: letters[position.col],
      number: position.row + 1,
    };
  }

  /**
   * Convert grid coordinates to position
   */
  gridToPosition(grid: GridPosition): Position {
    const letters = ['A', 'B', 'C'];
    return {
      row: grid.number - 1,
      col: letters.indexOf(grid.letter),
    };
  }

  /**
   * Validate grid coordinates
   */
  isValidGridPosition(grid: GridPosition): boolean {
    const letters = ['A', 'B', 'C'];
    return (
      letters.includes(grid.letter) && grid.number >= 1 && grid.number <= 3
    );
  }
}
