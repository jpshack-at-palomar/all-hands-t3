import { Player } from './player.js';
import {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
} from '../types/game.js';

export class RandomAIPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;

  constructor(symbol: PlayerType, name: string = 'Random AI') {
    super();
    this.symbol = symbol;
    this.name = name;
  }

  async getMove(gameState: GameStateType): Promise<Position> {
    const availableMoves = gameState.board.flatMap((row, rowIndex) =>
      row
        .map((cell, colIndex) =>
          cell === null ? { row: rowIndex, col: colIndex } : null
        )
        .filter(Boolean)
    ) as Position[];

    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    // Pick a random available move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }
}
