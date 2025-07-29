import type {
  GameState as GameStateType,
  Position,
  GameMove,
  MoveAnalysis,
  GridPosition,
} from '../types/game.js';
import { GameBoard } from './game-board.js';
import { MoveAnalyzer } from './move-analyzer.js';
import { ActionSpaceAnalyzer } from './action-space.js';
import type { ActionSpace } from './action-space.js';

export class GameState {
  private state: GameStateType;
  private board: GameBoard;
  private moveAnalyzer: MoveAnalyzer;
  private actionSpaceAnalyzer: ActionSpaceAnalyzer;

  constructor() {
    this.board = new GameBoard();
    this.moveAnalyzer = new MoveAnalyzer();
    this.actionSpaceAnalyzer = new ActionSpaceAnalyzer();
    this.state = {
      board: this.board.getBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    };
  }

  /**
   * Get current game state
   */
  getState(): GameStateType {
    return {
      ...this.state,
      board: this.state.board.map((row) => [...row]),
      moves: [...this.state.moves],
    };
  }

  /**
   * Make a move at the specified position
   */
  makeMove(position: Position): boolean {
    if (this.state.status !== 'playing') {
      return false;
    }

    if (!this.board.isEmpty(position)) {
      return false;
    }

    // Make the move
    this.board.setCell(position, this.state.currentPlayer);

    // Create move record
    const move: GameMove = {
      player: this.state.currentPlayer,
      position,
      gridPosition: this.board.positionToGrid(position),
      timestamp: Date.now(),
    };

    // Update state
    this.state.board = this.board.getBoard();
    this.state.moves.push(move);
    this.state.turnNumber++;

    // Check for win or draw
    this.checkGameEnd();

    // Switch players
    if (this.state.status === 'playing') {
      this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
    }

    return true;
  }

  /**
   * Check if the game has ended (win or draw)
   */
  private checkGameEnd(): void {
    const winner = this.moveAnalyzer.checkWinner(this.state.board);

    if (winner) {
      this.state.status = 'won';
      this.state.winner = winner;
    } else if (this.board.isFull()) {
      this.state.status = 'draw';
    }
  }

  /**
   * Get available moves for the current player
   */
  getAvailableMoves(): Position[] {
    return this.board.getEmptyPositions();
  }

  /**
   * Get move analysis for all available moves
   */
  getMoveAnalysis(): MoveAnalysis[] {
    return this.moveAnalyzer.analyzeMoves(this.state);
  }

  /**
   * Get the best moves ranked by win potential
   */
  getBestMoves(): MoveAnalysis[] {
    const analysis = this.getMoveAnalysis();
    return analysis.sort((a, b) => {
      // Sort by win potential (lower is better)
      const aWin = a.winInTurns ?? Infinity;
      const bWin = b.winInTurns ?? Infinity;

      if (aWin !== bWin) {
        return aWin - bWin;
      }

      // Then by other strategic factors
      if (a.blocksOpponentWin !== b.blocksOpponentWin) {
        return b.blocksOpponentWin ? 1 : -1;
      }

      if (a.createsFork !== b.createsFork) {
        return b.createsFork ? 1 : -1;
      }

      return 0;
    });
  }

  /**
   * Reset the game to initial state
   */
  reset(): void {
    this.board.reset();
    this.state = {
      board: this.board.getBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    };
  }

  /**
   * Get game history as a string
   */
  getHistory(): string {
    return this.state.moves
      .map(
        (move) =>
          `${move.player}: ${move.gridPosition.letter}${move.gridPosition.number}`
      )
      .join(', ');
  }

  /**
   * Get complete action space information
   */
  getActionSpace(): ActionSpace {
    return this.actionSpaceAnalyzer.getActionSpace(this.state);
  }

  /**
   * Get action space with grid coordinates
   */
  getActionSpaceWithGrid(): Array<Position & { gridPosition: GridPosition }> {
    return this.actionSpaceAnalyzer.getActionSpaceWithGrid(this.state);
  }

  /**
   * Get strategic action space
   */
  getStrategicActionSpace(
    criteria: 'winning' | 'blocking' | 'forking' | 'all'
  ): Position[] {
    return this.actionSpaceAnalyzer.getStrategicActionSpace(
      this.state,
      criteria
    );
  }

  /**
   * Get action space statistics
   */
  getActionSpaceStats(): {
    totalMoves: number;
    winningMoves: number;
    blockingMoves: number;
    forkingMoves: number;
    neutralMoves: number;
  } {
    return this.actionSpaceAnalyzer.getActionSpaceStats(this.state);
  }
}
