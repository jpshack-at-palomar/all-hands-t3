import type {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
  MoveAnalysis,
} from '../types/game.js';

export abstract class Player {
  abstract readonly symbol: PlayerType;
  abstract readonly name: string;

  abstract getMove(gameState: GameStateType): Promise<Position>;

  /**
   * Optional: For AI players to provide move analysis
   */
  analyzeMove?(gameState: GameStateType, position: Position): MoveAnalysis;
}
