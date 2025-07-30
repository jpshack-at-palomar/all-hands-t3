/* eslint-env node */
/* eslint-disable no-console, no-undef, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { GameEngine, Player } from '@pnpm-template/lib';
import {
  RandomAIPlayer,
  StrategicAIPlayer,
  HumanPlayer,
} from '@pnpm-template/lib';
import type { Position, GameState as GameStateType } from '@pnpm-template/lib';
import type { GameOptions, GameResult, GridPosition } from '../types/cli.js';

type AIPlayerType = 'random' | 'strategic';

export class GameController {
  private gameEngine: GameEngine | null;
  private humanPlayer: HumanPlayer | null;
  private aiPlayer: Player | null;

  constructor() {
    this.gameEngine = null;
    this.humanPlayer = null;
    this.aiPlayer = null;
  }

  /**
   * Play a complete game with the specified options
   */
  async playGame(options: GameOptions): Promise<GameResult> {
    this.initializeGame(options);

    if (!this.gameEngine) {
      throw new Error('Game engine not initialized');
    }

    console.log('Starting new game...');
    console.log(`Human plays ${options.humanFirst ? 'first' : 'second'}`);
    console.log(`AI type: ${options.aiType}`);
    console.log('');

    const moves: Array<{
      player: 'X' | 'O';
      position: string;
      turn: number;
    }> = [];

    let turnNumber = 1;

    while (!this.gameEngine.isGameOver()) {
      const gameState = this.gameEngine.getGameState();
      const currentPlayer = gameState.currentPlayer;
      const isHumanTurn = this.isHumanTurn(currentPlayer, options.humanFirst);

      let position: Position;

      if (isHumanTurn) {
        position = await this.getHumanMove();
      } else {
        position = await this.getAIMove(gameState as any);
      }

      // Make the move
      const success = this.gameEngine.makeMoveAt(position);
      if (!success) {
        throw new Error('Invalid move attempted');
      }

      // Record the move
      const gridPosition = this.positionToGridPosition(position);
      moves.push({
        player: currentPlayer,
        position: gridPosition,
        turn: turnNumber,
      });

      console.log(`Turn ${turnNumber}: ${currentPlayer} plays ${gridPosition}`);
      turnNumber++;
    }

    // Determine game result
    const winner = this.gameEngine.getWinner();
    const finalState = this.gameEngine.getGameState();
    const isDraw = finalState.status === 'draw';

    if (winner) {
      console.log(`🎉 ${winner} wins! 🎉`);
    } else {
      console.log('Game ended in a draw!');
    }

    return {
      winner,
      isDraw,
      moves,
    };
  }

  /**
   * Initialize a new game with the specified options
   */
  private initializeGame(options: GameOptions): void {
    this.createPlayers(options);

    if (!this.humanPlayer || !this.aiPlayer) {
      throw new Error('Players not created properly');
    }

    if (options.humanFirst) {
      this.gameEngine = new GameEngine(this.humanPlayer, this.aiPlayer);
    } else {
      this.gameEngine = new GameEngine(this.aiPlayer, this.humanPlayer);
    }
  }

  /**
   * Create players based on the specified options
   */
  private createPlayers(options: GameOptions): void {
    // Always create human player for X or O based on who goes first
    const humanSymbol = options.humanFirst ? 'X' : 'O';
    const aiSymbol = options.humanFirst ? 'O' : 'X';

    this.humanPlayer = new HumanPlayer(humanSymbol, 'Human');

    switch (options.aiType) {
      case 'random':
        this.aiPlayer = new RandomAIPlayer(aiSymbol, 'Random AI');
        break;
      case 'strategic':
        this.aiPlayer = new StrategicAIPlayer(aiSymbol, 'Strategic AI');
        break;
      default:
        throw new Error(`Unknown AI type: ${options.aiType}`);
    }
  }

  /**
   * Determine if it's the human player's turn
   */
  private isHumanTurn(currentPlayer: 'X' | 'O', humanFirst: boolean): boolean {
    if (humanFirst) {
      return currentPlayer === 'X';
    } else {
      return currentPlayer === 'O';
    }
  }

  /**
   * Get a move from the human player
   */
  private async getHumanMove(): Promise<Position> {
    if (!this.gameEngine) {
      throw new Error('Game engine not initialized');
    }

    const availablePositions = this.gameEngine.getAvailableMoves();

    // For now, use the first available position
    // This will be replaced with interactive prompts in the PromptManager
    if (availablePositions.length === 0) {
      throw new Error('No available moves');
    }

    return availablePositions[0];
  }

  /**
   * Get a move from the AI player
   */
  private async getAIMove(gameState: GameStateType): Promise<Position> {
    if (!this.aiPlayer) {
      throw new Error('AI player not initialized');
    }

    return this.aiPlayer.getMove(gameState as any);
  }

  /**
   * Convert a Position to a grid position string (e.g., A1, B2)
   */
  private positionToGridPosition(position: Position): GridPosition {
    const columns = ['A', 'B', 'C'] as const;
    const rows = [1, 2, 3] as const;

    return `${columns[position.col]}${rows[position.row]}` as GridPosition;
  }

  /**
   * Convert a grid position string to a Position
   */
  public gridPositionToPosition(gridPosition: GridPosition): Position {
    const column = gridPosition[0];
    const row = parseInt(gridPosition[1], 10);

    const colIndex = ['A', 'B', 'C'].indexOf(column);
    const rowIndex = [1, 2, 3].indexOf(row) >= 0 ? row - 1 : -1;

    if (colIndex === -1 || rowIndex === -1) {
      throw new Error(`Invalid grid position: ${gridPosition}`);
    }

    return { row: rowIndex, col: colIndex };
  }

  /**
   * Validate that a grid position is valid and available
   */
  public isValidMove(gridPosition: GridPosition): boolean {
    try {
      if (!this.gameEngine) {
        return false;
      }

      const position = this.gridPositionToPosition(gridPosition);
      const availableMoves = this.gameEngine.getAvailableMoves();

      return availableMoves.some(
        (move) => move.row === position.row && move.col === position.col
      );
    } catch {
      return false;
    }
  }

  /**
   * Get available moves as grid positions
   */
  public getAvailableGridPositions(): GridPosition[] {
    if (!this.gameEngine) {
      return [];
    }

    const availableMoves = this.gameEngine.getAvailableMoves();
    return availableMoves.map((pos) => this.positionToGridPosition(pos));
  }

  /**
   * Get the current game state (for testing purposes)
   */
  public getCurrentGameState(): any {
    if (!this.gameEngine) {
      return null;
    }

    return this.gameEngine.getGameState();
  }

  /**
   * Check if the game is over
   */
  public isGameOver(): boolean {
    if (!this.gameEngine) {
      return false;
    }

    return this.gameEngine.isGameOver();
  }

  /**
   * Make a move with a grid position
   */
  public makeGridMove(gridPosition: GridPosition): boolean {
    if (!this.gameEngine) {
      throw new Error('Game engine not initialized');
    }

    const position = this.gridPositionToPosition(gridPosition);
    return this.gameEngine.makeMoveAt(position);
  }
}
