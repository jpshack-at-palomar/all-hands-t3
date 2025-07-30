import type { Player as PlayerType } from '../types/game.js';
import type { Player } from './player.js';
import { RandomAIPlayer } from './random-ai-player.js';
import { StrategicAIPlayer } from './strategic-ai-player.js';
import { MinimaxAIPlayer } from './minimax-ai-player.js';

export interface AIPlayerInfo {
  id: string;
  name: string;
  description: string;
  class: new (symbol: PlayerType, name?: string) => Player;
}

export class AIPlayerFactory {
  private static readonly aiPlayers: Map<string, AIPlayerInfo> = new Map([
    [
      'random',
      {
        id: 'random',
        name: 'Random AI',
        description: 'Makes random moves from available positions',
        class: RandomAIPlayer,
      },
    ],
    [
      'strategic',
      {
        id: 'strategic',
        name: 'Strategic AI',
        description: 'Uses strategic analysis to make optimal moves',
        class: StrategicAIPlayer,
      },
    ],
    [
      'minimax',
      {
        id: 'minimax',
        name: 'Minimax AI',
        description:
          'Uses minimax algorithm with alpha-beta pruning for perfect play',
        class: MinimaxAIPlayer,
      },
    ],
  ]);

  /**
   * Get all available AI player types
   */
  static getAvailableAIs(): AIPlayerInfo[] {
    return Array.from(this.aiPlayers.values());
  }

  /**
   * Get AI player info by ID
   */
  static getAIPlayerInfo(id: string): AIPlayerInfo | undefined {
    return this.aiPlayers.get(id.toLowerCase());
  }

  /**
   * Check if an AI player type exists
   */
  static hasAIPlayer(id: string): boolean {
    return this.aiPlayers.has(id.toLowerCase());
  }

  /**
   * Create an AI player by ID
   */
  static createAIPlayer(id: string, symbol: PlayerType, name?: string): Player {
    const aiInfo = this.getAIPlayerInfo(id);
    if (!aiInfo) {
      throw new Error(
        `Unknown AI player type: ${id}. Available types: ${Array.from(this.aiPlayers.keys()).join(', ')}`
      );
    }

    return new aiInfo.class(symbol, name || aiInfo.name);
  }

  /**
   * Get a list of available AI player IDs
   */
  static getAvailableAIIds(): string[] {
    return Array.from(this.aiPlayers.keys());
  }
}
