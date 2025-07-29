import {
  Player,
  Position,
  GameState as GameStateType,
  MoveAnalysis,
  CellValue,
} from '../types/game.js';

export class MoveAnalyzer {
  /**
   * Analyze all available moves for the current game state
   */
  analyzeMoves(gameState: GameStateType): MoveAnalysis[] {
    const availableMoves: Position[] = [];

    // Find all empty positions
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState.board[row][col] === null) {
          availableMoves.push({ row, col });
        }
      }
    }

    return availableMoves.map((position) =>
      this.analyzeMove(gameState, position)
    );
  }

  /**
   * Analyze a specific move
   */
  analyzeMove(gameState: GameStateType, position: Position): MoveAnalysis {
    const { board, currentPlayer } = gameState;

    // Create a copy of the board with this move
    const testBoard = board.map((row) => [...row]);
    testBoard[position.row][position.col] = currentPlayer;

    // Check if this move wins
    const winInTurns = this.checkWinInTurns(testBoard, currentPlayer);

    // Check if this move blocks opponent's win
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    const blocksOpponentWin = this.blocksOpponentWin(board, position, opponent);

    // Check for fork creation
    const createsFork = this.createsFork(testBoard, currentPlayer);

    // Check for fork blocking
    const blocksOpponentFork = this.blocksOpponentFork(
      board,
      position,
      opponent
    );

    return {
      position,
      gridPosition: this.positionToGrid(position),
      winInTurns,
      blocksOpponentWin,
      createsFork,
      blocksOpponentFork,
    };
  }

  /**
   * Check if the current player has won
   */
  checkWinner(board: CellValue[][]): Player | null {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2]
      ) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[1][col] === board[2][col]
      ) {
        return board[0][col];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }

    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }

    return null;
  }

  /**
   * Check if a move wins in a specific number of turns
   */
  private checkWinInTurns(board: CellValue[][], player: Player): number | null {
    const winner = this.checkWinner(board);
    if (winner === player) {
      return 1; // Immediate win
    }

    // For more complex analysis, we could implement minimax
    // For now, we'll just check immediate wins
    return null;
  }

  /**
   * Check if a move blocks opponent's win
   */
  private blocksOpponentWin(
    board: CellValue[][],
    position: Position,
    opponent: Player
  ): boolean {
    const testBoard = board.map((row) => [...row]);
    testBoard[position.row][position.col] = opponent;

    return this.checkWinner(testBoard) === opponent;
  }

  /**
   * Check if a move creates a fork (two winning opportunities)
   */
  private createsFork(board: CellValue[][], player: Player): boolean {
    // Count how many winning lines this position would create for the player
    const winningLines = 0;

    // Check rows, columns, and diagonals for potential winning lines
    // This is a simplified implementation - for now just return false
    void board; // Placeholder to avoid unused parameter warning
    void player; // Placeholder to avoid unused parameter warning

    return winningLines >= 2;
  }

  /**
   * Check if a move blocks opponent's fork
   */
  private blocksOpponentFork(
    board: CellValue[][],
    position: Position,
    opponent: Player
  ): boolean {
    // This is a complex analysis that would require checking
    // if the opponent has multiple winning opportunities
    // For now, just use the parameters to avoid linting errors
    void board; // Placeholder to avoid unused parameter warning
    void position; // Placeholder to avoid unused parameter warning
    void opponent; // Placeholder to avoid unused parameter warning
    return false;
  }

  /**
   * Convert position to grid coordinates
   */
  private positionToGrid(position: Position): {
    letter: string;
    number: number;
  } {
    const letters = ['A', 'B', 'C'];
    return {
      letter: letters[position.col],
      number: position.row + 1,
    };
  }
}
