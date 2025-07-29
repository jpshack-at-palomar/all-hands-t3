import type {
  Position,
  GameState as GameStateType,
  MoveAnalysis,
  GridPosition,
} from '../types/game.js';
import { MoveAnalyzer } from './move-analyzer.js';

export interface ActionSpace {
  availableMoves: Position[];
  totalMoves: number;
  strategicMoves: MoveAnalysis[];
  bestMove: Position | null;
  gamePhase: 'opening' | 'midgame' | 'endgame';
}

export class ActionSpaceAnalyzer {
  private moveAnalyzer: MoveAnalyzer;

  constructor() {
    this.moveAnalyzer = new MoveAnalyzer();
  }

  /**
   * Get the complete action space for the current game state
   */
  getActionSpace(gameState: GameStateType): ActionSpace {
    const availableMoves = this.getAvailableMoves(gameState);
    const strategicMoves = this.moveAnalyzer.analyzeMoves(gameState);
    const bestMove = this.getBestMove(strategicMoves);
    const gamePhase = this.determineGamePhase(gameState);

    return {
      availableMoves,
      totalMoves: availableMoves.length,
      strategicMoves,
      bestMove,
      gamePhase,
    };
  }

  /**
   * Get all available moves (basic action space)
   */
  getAvailableMoves(gameState: GameStateType): Position[] {
    const moves: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState.board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  /**
   * Get action space with grid coordinates
   */
  getActionSpaceWithGrid(
    gameState: GameStateType
  ): Array<Position & { gridPosition: GridPosition }> {
    const moves = this.getAvailableMoves(gameState);
    return moves.map((move) => ({
      ...move,
      gridPosition: {
        letter: ['A', 'B', 'C'][move.col],
        number: move.row + 1,
      },
    }));
  }

  /**
   * Get action space filtered by strategic criteria
   */
  getStrategicActionSpace(
    gameState: GameStateType,
    criteria: 'winning' | 'blocking' | 'forking' | 'all'
  ): Position[] {
    const analysis = this.moveAnalyzer.analyzeMoves(gameState);

    switch (criteria) {
      case 'winning':
        return analysis
          .filter((move) => move.winInTurns !== null)
          .map((move) => move.position);

      case 'blocking':
        return analysis
          .filter((move) => move.blocksOpponentWin)
          .map((move) => move.position);

      case 'forking':
        return analysis
          .filter((move) => move.createsFork)
          .map((move) => move.position);

      case 'all':
        return analysis
          .filter(
            (move) =>
              move.winInTurns !== null ||
              move.blocksOpponentWin ||
              move.createsFork ||
              move.blocksOpponentFork
          )
          .map((move) => move.position);

      default:
        return [];
    }
  }

  /**
   * Get the best move from strategic analysis
   */
  private getBestMove(strategicMoves: MoveAnalysis[]): Position | null {
    if (strategicMoves.length === 0) {
      return null;
    }

    // Prioritize: winning moves > blocking > forking > neutral

    // First, look for winning moves
    const winningMoves = strategicMoves.filter(
      (move) => move.winInTurns !== null
    );
    if (winningMoves.length > 0) {
      // Choose the fastest win
      winningMoves.sort((a, b) => (a.winInTurns || 0) - (b.winInTurns || 0));
      return winningMoves[0].position;
    }

    // Second, look for blocking moves
    const blockingMoves = strategicMoves.filter(
      (move) => move.blocksOpponentWin
    );
    if (blockingMoves.length > 0) {
      return blockingMoves[0].position;
    }

    // Third, look for forking moves
    const forkingMoves = strategicMoves.filter((move) => move.createsFork);
    if (forkingMoves.length > 0) {
      return forkingMoves[0].position;
    }

    // Fourth, look for moves that block opponent forks
    const blockForkMoves = strategicMoves.filter(
      (move) => move.blocksOpponentFork
    );
    if (blockForkMoves.length > 0) {
      return blockForkMoves[0].position;
    }

    // Otherwise, return the first available move
    return strategicMoves[0].position;
  }

  /**
   * Determine the current game phase
   */
  private determineGamePhase(
    gameState: GameStateType
  ): 'opening' | 'midgame' | 'endgame' {
    const turnNumber = gameState.turnNumber;

    if (turnNumber <= 2) {
      return 'opening';
    } else if (turnNumber <= 6) {
      return 'midgame';
    } else {
      return 'endgame';
    }
  }

  /**
   * Get action space statistics
   */
  getActionSpaceStats(gameState: GameStateType): {
    totalMoves: number;
    winningMoves: number;
    blockingMoves: number;
    forkingMoves: number;
    neutralMoves: number;
  } {
    const analysis = this.moveAnalyzer.analyzeMoves(gameState);

    return {
      totalMoves: analysis.length,
      winningMoves: analysis.filter((move) => move.winInTurns !== null).length,
      blockingMoves: analysis.filter((move) => move.blocksOpponentWin).length,
      forkingMoves: analysis.filter((move) => move.createsFork).length,
      neutralMoves: analysis.filter(
        (move) =>
          move.winInTurns === null &&
          !move.blocksOpponentWin &&
          !move.createsFork
      ).length,
    };
  }
}
