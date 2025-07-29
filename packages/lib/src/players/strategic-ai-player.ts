import { Player } from './player.js';
import type {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
  MoveAnalysis,
} from '../types/game.js';
import { MoveAnalyzer } from '../game/move-analyzer.js';

export class StrategicAIPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;
  private moveAnalyzer: MoveAnalyzer;

  constructor(symbol: PlayerType, name: string = 'Strategic AI') {
    super();
    this.symbol = symbol;
    this.name = name;
    this.moveAnalyzer = new MoveAnalyzer();
  }

  async getMove(gameState: GameStateType): Promise<Position> {
    const analysis = this.moveAnalyzer.analyzeMoves(gameState);

    if (analysis.length === 0) {
      throw new Error('No available moves');
    }

    // Find the best move
    const bestMove = analysis.reduce((best, current) => {
      // Prioritize winning moves
      if (
        current.winInTurns !== null &&
        (best.winInTurns === null || current.winInTurns < best.winInTurns)
      ) {
        return current;
      }

      // Then blocking moves
      if (current.blocksOpponentWin && !best.blocksOpponentWin) {
        return current;
      }

      // Then fork creation
      if (current.createsFork && !best.createsFork) {
        return current;
      }

      // Then fork blocking
      if (current.blocksOpponentFork && !best.blocksOpponentFork) {
        return current;
      }

      return best;
    });

    return bestMove.position;
  }

  analyzeMove(gameState: GameStateType, position: Position): MoveAnalysis {
    return this.moveAnalyzer.analyzeMove(gameState, position);
  }
}
