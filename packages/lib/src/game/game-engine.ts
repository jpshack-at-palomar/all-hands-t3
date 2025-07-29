import type {
  Player as PlayerType,
  GameState as GameStateType,
  Position,
  MoveAnalysis,
} from '../types/game.js';
import type { Player } from '../players/player.js';
import { GameState } from './game-state.js';
import { HumanPlayer } from '../players/human-player.js';
import { RandomAIPlayer } from '../players/random-ai-player.js';
import { StrategicAIPlayer } from '../players/strategic-ai-player.js';

export class GameEngine {
  private gameState: GameState;
  private playerX: Player;
  private playerO: Player;

  constructor(playerX: Player, playerO: Player) {
    this.gameState = new GameState();
    this.playerX = playerX;
    this.playerO = playerO;
  }

  /**
   * Get current game state
   */
  getGameState(): GameStateType {
    return this.gameState.getState();
  }

  /**
   * Make a move for the current player
   */
  async makeMove(): Promise<boolean> {
    const state = this.gameState.getState();

    if (state.status !== 'playing') {
      return false;
    }

    const currentPlayer =
      state.currentPlayer === 'X' ? this.playerX : this.playerO;
    const position = await currentPlayer.getMove(state);

    return this.gameState.makeMove(position);
  }

  /**
   * Make a move at a specific position (for human players)
   */
  makeMoveAt(position: Position): boolean {
    return this.gameState.makeMove(position);
  }

  /**
   * Get available moves
   */
  getAvailableMoves(): Position[] {
    return this.gameState.getAvailableMoves();
  }

  /**
   * Get move analysis
   */
  getMoveAnalysis(): MoveAnalysis[] {
    return this.gameState.getMoveAnalysis();
  }

  /**
   * Get best moves ranked by win potential
   */
  getBestMoves(): MoveAnalysis[] {
    return this.gameState.getBestMoves();
  }

  /**
   * Check if the game is over
   */
  isGameOver(): boolean {
    const state = this.gameState.getState();
    return state.status !== 'playing';
  }

  /**
   * Get the winner
   */
  getWinner(): PlayerType | null {
    const state = this.gameState.getState();
    return state.winner;
  }

  /**
   * Reset the game
   */
  reset(): void {
    this.gameState.reset();
  }

  /**
   * Get game history
   */
  getHistory(): string {
    return this.gameState.getHistory();
  }

  /**
   * Create a game with two human players
   */
  static createHumanVsHuman(): GameEngine {
    return new GameEngine(
      new HumanPlayer('X', 'Player X'),
      new HumanPlayer('O', 'Player O')
    );
  }

  /**
   * Create a game with human vs random AI
   */
  static createHumanVsRandomAI(): GameEngine {
    return new GameEngine(
      new HumanPlayer('X', 'Human'),
      new RandomAIPlayer('O', 'Random AI')
    );
  }

  /**
   * Create a game with human vs strategic AI
   */
  static createHumanVsStrategicAI(): GameEngine {
    return new GameEngine(
      new HumanPlayer('X', 'Human'),
      new StrategicAIPlayer('O', 'Strategic AI')
    );
  }

  /**
   * Create a game with random AI vs strategic AI
   */
  static createRandomAIVsStrategicAI(): GameEngine {
    return new GameEngine(
      new RandomAIPlayer('X', 'Random AI'),
      new StrategicAIPlayer('O', 'Strategic AI')
    );
  }
}
