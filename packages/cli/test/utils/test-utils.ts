/* eslint-env node */
/* eslint-disable no-undef */
import { OclifTestUtils } from './oclif-test-utils.js';
import type {
  GameResult,
  MatchResult,
  GridPosition,
} from '../../src/types/cli.js';

export class CLITestUtils {
  /**
   * Run a new game command with specified arguments
   */
  static async runNewCommand(args: string[] = []): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    exitCode?: number;
  }> {
    return OclifTestUtils.runCommand(['new', ...args]);
  }

  /**
   * Run a match command with specified arguments
   */
  static async runMatchCommand(args: string[] = []): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    exitCode?: number;
  }> {
    return OclifTestUtils.runCommand(['match', ...args]);
  }

  /**
   * Simulate a complete game with predefined moves
   */
  static async simulateGame(moves: string[]): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    gameResult?: GameResult;
  }> {
    return OclifTestUtils.simulateInteractiveCommand(['new'], moves);
  }

  /**
   * Simulate a complete match with predefined moves for each game
   */
  static async simulateMatch(
    gameCount: number,
    moveSequences: string[][]
  ): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    matchResult?: MatchResult;
  }> {
    const allMoves = moveSequences.flat();
    return OclifTestUtils.simulateInteractiveCommand(
      ['match', '--games', gameCount.toString()],
      allMoves
    );
  }

  /**
   * Test invalid move handling
   */
  static async testInvalidMoves(invalidMoves: string[]): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    return OclifTestUtils.simulateInteractiveCommand(['new'], invalidMoves);
  }

  /**
   * Generate valid grid positions for testing
   */
  static getValidGridPositions(): GridPosition[] {
    return ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
  }

  /**
   * Generate invalid grid positions for testing
   */
  static getInvalidGridPositions(): string[] {
    return ['A4', 'D1', 'Z9', '1A', '', 'AA', '11', 'a1', 'b2'];
  }

  /**
   * Create a winning move sequence for X
   */
  static getWinningSequenceX(): string[] {
    return ['A1', 'B1', 'A2', 'B2', 'A3']; // X wins with top row
  }

  /**
   * Create a winning move sequence for O (when O goes first)
   */
  static getWinningSequenceO(): string[] {
    return ['A1', 'B1', 'A2', 'B2', 'C1', 'B3']; // O wins with middle column
  }

  /**
   * Create a move sequence that results in a draw
   */
  static getDrawSequence(): string[] {
    return ['A1', 'A2', 'A3', 'B1', 'B3', 'B2', 'C2', 'C1', 'C3'];
  }

  /**
   * Test command help output
   */
  static async testCommandHelp(command: string): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    return OclifTestUtils.runCommand([command, '--help']);
  }

  /**
   * Test command with invalid flags
   */
  static async testInvalidFlags(
    command: string,
    invalidFlags: string[]
  ): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    return OclifTestUtils.runCommand([command, ...invalidFlags]);
  }

  /**
   * Parse game result from CLI output
   */
  static parseGameResult(output: string): GameResult | null {
    try {
      // Look for game result patterns in output
      const winnerMatch = output.match(/Winner: ([XO]|Draw)/);
      const movesMatch = output.match(/Moves: (.+)/);

      if (!winnerMatch || !movesMatch) {
        return null;
      }

      const winner =
        winnerMatch[1] === 'Draw' ? null : (winnerMatch[1] as 'X' | 'O');
      const isDraw = winnerMatch[1] === 'Draw';

      const moveStrings = movesMatch[1].split(', ');
      const moves = moveStrings.map((moveStr, index) => {
        const [player, position] = moveStr.split(':');
        return {
          player: player as 'X' | 'O',
          position,
          turn: index + 1,
        };
      });

      return {
        winner,
        isDraw,
        moves,
      };
    } catch {
      return null;
    }
  }

  /**
   * Parse match result from CLI output
   */
  static parseMatchResult(output: string): MatchResult | null {
    try {
      const gamesMatch = output.match(/Games played: (\d+)/);
      const humanWinsMatch = output.match(/Human wins: (\d+)/);
      const aiWinsMatch = output.match(/AI wins: (\d+)/);
      const drawsMatch = output.match(/Draws: (\d+)/);
      const winnerMatch = output.match(/Match winner: (human|ai|tie)/);

      if (
        !gamesMatch ||
        !humanWinsMatch ||
        !aiWinsMatch ||
        !drawsMatch ||
        !winnerMatch
      ) {
        return null;
      }

      return {
        games: [], // Individual games would need separate parsing
        humanWins: parseInt(humanWinsMatch[1], 10),
        aiWins: parseInt(aiWinsMatch[1], 10),
        draws: parseInt(drawsMatch[1], 10),
        winner: winnerMatch[1] as 'human' | 'ai' | 'tie',
      };
    } catch {
      return null;
    }
  }

  /**
   * Verify command execution time is within acceptable limits
   */
  static async measureCommandPerformance(
    command: string[],
    maxTimeMs: number = 5000
  ): Promise<{
    executionTime: number;
    withinLimit: boolean;
    result: {
      stdout: string;
      stderr: string;
      error?: Error;
    };
  }> {
    const startTime = Date.now();
    const result = await OclifTestUtils.runCommand(command);
    const executionTime = Date.now() - startTime;

    return {
      executionTime,
      withinLimit: executionTime <= maxTimeMs,
      result,
    };
  }

  /**
   * Test CLI command with timeout
   */
  static async runCommandWithTimeout(
    command: string[],
    timeoutMs: number = 10000
  ): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    timedOut: boolean;
  }> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          stdout: '',
          stderr: 'Command timed out',
          error: new Error('Command timed out'),
          timedOut: true,
        });
      }, timeoutMs);

      OclifTestUtils.runCommand(command).then((result) => {
        clearTimeout(timeout);
        resolve({
          ...result,
          timedOut: false,
        });
      });
    });
  }
}
