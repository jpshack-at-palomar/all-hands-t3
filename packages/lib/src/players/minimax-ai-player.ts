import { Player } from './player.js';
import type {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
  MoveAnalysis,
  CellValue,
} from '../types/game.js';
import { MoveAnalyzer } from '../game/move-analyzer.js';

export class MinimaxAIPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;
  private moveAnalyzer: MoveAnalyzer;
  private maxDepth: number;

  constructor(
    symbol: PlayerType,
    name: string = 'Minimax AI',
    maxDepth: number = 9
  ) {
    super();
    this.symbol = symbol;
    this.name = name;
    this.moveAnalyzer = new MoveAnalyzer();
    this.maxDepth = maxDepth;
  }

  async getMove(gameState: GameStateType): Promise<Position> {
    const availableMoves = this.getAvailableMoves(gameState.board);

    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    // If it's the first move (empty board), choose a strategic position
    if (this.isBoardEmpty(gameState.board)) {
      return this.getFirstMove();
    }

    // Use minimax to find the best move
    let bestScore = -Infinity;
    let bestMove: Position | null = null;

    for (const move of availableMoves) {
      // Create a copy of the board with this move
      const testBoard = this.makeMoveOnBoard(
        gameState.board,
        move,
        this.symbol
      );

      // Calculate score for this move (always from maximizing perspective)
      const score = this.minimax(
        testBoard,
        this.maxDepth - 1,
        false, // opponent's turn
        -Infinity,
        Infinity
      );

      // Update best move (we're always maximizing from our perspective)
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }

    if (!bestMove) {
      // Fallback to first available move
      bestMove = availableMoves[0];
    }

    return bestMove;
  }

  /**
   * Minimax algorithm with alpha-beta pruning
   */
  private minimax(
    board: CellValue[][],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number
  ): number {
    // Terminal conditions
    const winner = this.checkWinner(board);
    if (winner === this.symbol) {
      return 10 + depth; // Win (prefer faster wins)
    } else if (winner === this.getOpponent()) {
      return -10 - depth; // Loss (prefer slower losses)
    } else if (this.isBoardFull(board) || depth === 0) {
      return 0; // Draw or max depth reached
    }

    const availableMoves = this.getAvailableMoves(board);

    if (isMaximizing) {
      let maxScore = -Infinity;
      for (const move of availableMoves) {
        const testBoard = this.makeMoveOnBoard(board, move, this.symbol);
        const score = this.minimax(testBoard, depth - 1, false, alpha, beta);
        maxScore = Math.max(maxScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return maxScore;
    } else {
      let minScore = Infinity;
      for (const move of availableMoves) {
        const testBoard = this.makeMoveOnBoard(board, move, this.getOpponent());
        const score = this.minimax(testBoard, depth - 1, true, alpha, beta);
        minScore = Math.min(minScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Alpha-beta pruning
      }
      return minScore;
    }
  }

  /**
   * Get available moves from board
   */
  private getAvailableMoves(board: CellValue[][]): Position[] {
    const moves: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  /**
   * Make a move on a board copy
   */
  private makeMoveOnBoard(
    board: CellValue[][],
    position: Position,
    player: PlayerType
  ): CellValue[][] {
    const newBoard = board.map((row) => [...row]);
    newBoard[position.row][position.col] = player;
    return newBoard;
  }

  /**
   * Check if there's a winner on the board
   */
  private checkWinner(board: CellValue[][]): PlayerType | null {
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
   * Check if board is empty
   */
  private isBoardEmpty(board: CellValue[][]): boolean {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Check if board is full (draw)
   */
  private isBoardFull(board: CellValue[][]): boolean {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Get opponent symbol
   */
  private getOpponent(): PlayerType {
    return this.symbol === 'X' ? 'O' : 'X';
  }

  /**
   * Get strategic first move
   */
  private getFirstMove(): Position {
    // Return center for first move (optimal strategy)
    return { row: 1, col: 1 };
  }

  /**
   * Analyze a specific move (for compatibility with other AI players)
   */
  analyzeMove(gameState: GameStateType, position: Position): MoveAnalysis {
    return this.moveAnalyzer.analyzeMove(gameState, position);
  }
}
