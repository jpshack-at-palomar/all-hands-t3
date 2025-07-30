import { describe, it, expect } from 'vitest';
import type {
  GameOptions,
  MatchOptions,
  MoveInput,
  GameResult,
  MatchResult,
  GridColumn,
  GridRow,
  GridPosition,
  CommandResult,
  PromptOptions,
  PromptResult,
  AIPlayerType,
  TurnInfo,
} from '../../src/types/cli.js';

describe('CLI Types', () => {
  describe('GameOptions', () => {
    it('should accept valid game options', () => {
      const gameOptions: GameOptions = {
        aiType: 'random',
        humanFirst: true,
      };

      expect(gameOptions.aiType).toBe('random');
      expect(gameOptions.humanFirst).toBe(true);
    });

    it('should accept strategic AI type', () => {
      const gameOptions: GameOptions = {
        aiType: 'strategic',
        humanFirst: false,
      };

      expect(gameOptions.aiType).toBe('strategic');
      expect(gameOptions.humanFirst).toBe(false);
    });
  });

  describe('MatchOptions', () => {
    it('should accept valid match options', () => {
      const matchOptions: MatchOptions = {
        games: 3,
        aiType: 'random',
      };

      expect(matchOptions.games).toBe(3);
      expect(matchOptions.aiType).toBe('random');
    });

    it('should accept strategic AI type for matches', () => {
      const matchOptions: MatchOptions = {
        games: 5,
        aiType: 'strategic',
      };

      expect(matchOptions.games).toBe(5);
      expect(matchOptions.aiType).toBe('strategic');
    });
  });

  describe('MoveInput', () => {
    it('should accept valid move input', () => {
      const moveInput: MoveInput = {
        gridPosition: 'A1',
        position: { row: 0, col: 0 },
      };

      expect(moveInput.gridPosition).toBe('A1');
      expect(moveInput.position.row).toBe(0);
      expect(moveInput.position.col).toBe(0);
    });
  });

  describe('GameResult', () => {
    it('should accept game result with winner', () => {
      const gameResult: GameResult = {
        winner: 'X',
        isDraw: false,
        moves: [
          { player: 'X', position: 'A1', turn: 1 },
          { player: 'O', position: 'B2', turn: 2 },
          { player: 'X', position: 'C3', turn: 3 },
        ],
      };

      expect(gameResult.winner).toBe('X');
      expect(gameResult.isDraw).toBe(false);
      expect(gameResult.moves).toHaveLength(3);
    });

    it('should accept game result with draw', () => {
      const gameResult: GameResult = {
        winner: null,
        isDraw: true,
        moves: [
          { player: 'X', position: 'A1', turn: 1 },
          { player: 'O', position: 'B2', turn: 2 },
        ],
      };

      expect(gameResult.winner).toBe(null);
      expect(gameResult.isDraw).toBe(true);
    });
  });

  describe('MatchResult', () => {
    it('should accept valid match result', () => {
      const matchResult: MatchResult = {
        games: [],
        humanWins: 2,
        aiWins: 1,
        draws: 0,
        winner: 'human',
      };

      expect(matchResult.humanWins).toBe(2);
      expect(matchResult.aiWins).toBe(1);
      expect(matchResult.draws).toBe(0);
      expect(matchResult.winner).toBe('human');
    });
  });

  describe('Grid Types', () => {
    it('should accept valid grid positions', () => {
      const validPositions: GridPosition[] = [
        'A1',
        'A2',
        'A3',
        'B1',
        'B2',
        'B3',
        'C1',
        'C2',
        'C3',
      ];

      validPositions.forEach((position) => {
        expect(typeof position).toBe('string');
        expect(position).toMatch(/^[ABC][123]$/);
      });
    });

    it('should type check grid columns', () => {
      const columns: GridColumn[] = ['A', 'B', 'C'];
      expect(columns).toHaveLength(3);
    });

    it('should type check grid rows', () => {
      const rows: GridRow[] = [1, 2, 3];
      expect(rows).toHaveLength(3);
    });
  });

  describe('CommandResult', () => {
    it('should accept successful command result', () => {
      const result: CommandResult = {
        success: true,
        message: 'Command executed successfully',
        data: { gameId: 123 },
      };

      expect(result.success).toBe(true);
      expect(result.message).toBe('Command executed successfully');
      expect(result.data).toEqual({ gameId: 123 });
    });

    it('should accept failed command result', () => {
      const result: CommandResult = {
        success: false,
        message: 'Command failed',
      };

      expect(result.success).toBe(false);
      expect(result.message).toBe('Command failed');
      expect(result.data).toBeUndefined();
    });
  });

  describe('PromptOptions', () => {
    it('should accept prompt options with choices', () => {
      const promptOptions: PromptOptions = {
        message: 'Select your move:',
        choices: ['A1', 'B2', 'C3'],
        validate: (input: string) => input.length > 0,
      };

      expect(promptOptions.message).toBe('Select your move:');
      expect(promptOptions.choices).toEqual(['A1', 'B2', 'C3']);
      expect(typeof promptOptions.validate).toBe('function');
    });
  });

  describe('PromptResult', () => {
    it('should accept prompt result', () => {
      const promptResult: PromptResult = {
        value: 'A1',
        cancelled: false,
      };

      expect(promptResult.value).toBe('A1');
      expect(promptResult.cancelled).toBe(false);
    });
  });

  describe('AIPlayerType', () => {
    it('should accept valid AI player types', () => {
      const randomAI: AIPlayerType = 'random';
      const strategicAI: AIPlayerType = 'strategic';

      expect(randomAI).toBe('random');
      expect(strategicAI).toBe('strategic');
    });
  });

  describe('TurnInfo', () => {
    it('should accept turn information', () => {
      const turnInfo: TurnInfo = {
        player: 'X',
        position: 'A1',
        turn: 1,
        isHuman: true,
      };

      expect(turnInfo.player).toBe('X');
      expect(turnInfo.position).toBe('A1');
      expect(turnInfo.turn).toBe(1);
      expect(turnInfo.isHuman).toBe(true);
    });
  });
});
