import { Player } from './player.js';
import {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
} from '../types/game.js';

export class HumanPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;

  constructor(symbol: PlayerType, name: string = 'Human') {
    super();
    this.symbol = symbol;
    this.name = name;
  }

  async getMove(gameState: GameStateType): Promise<Position> {
    // This would be implemented by the UI layer
    // For now, we'll throw an error indicating UI is needed
    void gameState; // Avoid unused parameter warning
    throw new Error('Human player requires UI implementation');
  }
}
