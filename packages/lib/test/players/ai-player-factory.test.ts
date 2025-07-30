import { describe, it, expect } from 'vitest';
import { AIPlayerFactory } from '../../src/players/ai-player-factory.js';
import { RandomAIPlayer } from '../../src/players/random-ai-player.js';
import { StrategicAIPlayer } from '../../src/players/strategic-ai-player.js';
import { MinimaxAIPlayer } from '../../src/players/minimax-ai-player.js';
import { GameEngine } from '../../src/game/game-engine.js';

describe('AIPlayerFactory', () => {
  describe('getAvailableAIs', () => {
    it('should return all available AI player types', () => {
      const availableAIs = AIPlayerFactory.getAvailableAIs();

      expect(availableAIs).toHaveLength(3);

      const randomAI = availableAIs.find((ai) => ai.id === 'random');
      expect(randomAI).toBeDefined();
      expect(randomAI?.name).toBe('Random AI');
      expect(randomAI?.description).toBe(
        'Makes random moves from available positions'
      );
      expect(randomAI?.class).toBe(RandomAIPlayer);

      const strategicAI = availableAIs.find((ai) => ai.id === 'strategic');
      expect(strategicAI).toBeDefined();
      expect(strategicAI?.name).toBe('Strategic AI');
      expect(strategicAI?.description).toBe(
        'Uses strategic analysis to make optimal moves'
      );
      expect(strategicAI?.class).toBe(StrategicAIPlayer);

      const minimaxAI = availableAIs.find((ai) => ai.id === 'minimax');
      expect(minimaxAI).toBeDefined();
      expect(minimaxAI?.name).toBe('Minimax AI');
      expect(minimaxAI?.description).toBe(
        'Uses minimax algorithm with alpha-beta pruning for perfect play'
      );
      expect(minimaxAI?.class).toBe(MinimaxAIPlayer);
    });
  });

  describe('getAIPlayerInfo', () => {
    it('should return AI player info for valid IDs', () => {
      const randomInfo = AIPlayerFactory.getAIPlayerInfo('random');
      expect(randomInfo).toBeDefined();
      expect(randomInfo?.id).toBe('random');
      expect(randomInfo?.class).toBe(RandomAIPlayer);

      const strategicInfo = AIPlayerFactory.getAIPlayerInfo('strategic');
      expect(strategicInfo).toBeDefined();
      expect(strategicInfo?.id).toBe('strategic');
      expect(strategicInfo?.class).toBe(StrategicAIPlayer);

      const minimaxInfo = AIPlayerFactory.getAIPlayerInfo('minimax');
      expect(minimaxInfo).toBeDefined();
      expect(minimaxInfo?.id).toBe('minimax');
      expect(minimaxInfo?.class).toBe(MinimaxAIPlayer);
    });

    it('should return undefined for invalid IDs', () => {
      const invalidInfo = AIPlayerFactory.getAIPlayerInfo('invalid');
      expect(invalidInfo).toBeUndefined();
    });

    it('should be case insensitive', () => {
      const randomInfo = AIPlayerFactory.getAIPlayerInfo('RANDOM');
      expect(randomInfo).toBeDefined();
      expect(randomInfo?.id).toBe('random');
    });
  });

  describe('hasAIPlayer', () => {
    it('should return true for valid AI player IDs', () => {
      expect(AIPlayerFactory.hasAIPlayer('random')).toBe(true);
      expect(AIPlayerFactory.hasAIPlayer('strategic')).toBe(true);
      expect(AIPlayerFactory.hasAIPlayer('minimax')).toBe(true);
    });

    it('should return false for invalid AI player IDs', () => {
      expect(AIPlayerFactory.hasAIPlayer('invalid')).toBe(false);
      expect(AIPlayerFactory.hasAIPlayer('')).toBe(false);
    });

    it('should be case insensitive', () => {
      expect(AIPlayerFactory.hasAIPlayer('RANDOM')).toBe(true);
      expect(AIPlayerFactory.hasAIPlayer('Strategic')).toBe(true);
    });
  });

  describe('createAIPlayer', () => {
    it('should create a random AI player', () => {
      const player = AIPlayerFactory.createAIPlayer(
        'random',
        'X',
        'Test Random AI'
      );

      expect(player).toBeInstanceOf(RandomAIPlayer);
      expect(player.symbol).toBe('X');
      expect(player.name).toBe('Test Random AI');
    });

    it('should create a strategic AI player', () => {
      const player = AIPlayerFactory.createAIPlayer(
        'strategic',
        'O',
        'Test Strategic AI'
      );

      expect(player).toBeInstanceOf(StrategicAIPlayer);
      expect(player.symbol).toBe('O');
      expect(player.name).toBe('Test Strategic AI');
    });

    it('should create a minimax AI player', () => {
      const player = AIPlayerFactory.createAIPlayer(
        'minimax',
        'X',
        'Test Minimax AI'
      );

      expect(player).toBeInstanceOf(MinimaxAIPlayer);
      expect(player.symbol).toBe('X');
      expect(player.name).toBe('Test Minimax AI');
    });

    it('should use default name when not provided', () => {
      const randomPlayer = AIPlayerFactory.createAIPlayer('random', 'X');
      expect(randomPlayer.name).toBe('Random AI');

      const strategicPlayer = AIPlayerFactory.createAIPlayer('strategic', 'O');
      expect(strategicPlayer.name).toBe('Strategic AI');

      const minimaxPlayer = AIPlayerFactory.createAIPlayer('minimax', 'X');
      expect(minimaxPlayer.name).toBe('Minimax AI');
    });

    it('should be case insensitive for AI type', () => {
      const player = AIPlayerFactory.createAIPlayer('RANDOM', 'X');
      expect(player).toBeInstanceOf(RandomAIPlayer);
    });

    it('should throw error for invalid AI type', () => {
      expect(() => {
        AIPlayerFactory.createAIPlayer('invalid', 'X');
      }).toThrow(
        'Unknown AI player type: invalid. Available types: random, strategic, minimax'
      );
    });
  });

  describe('getAvailableAIIds', () => {
    it('should return all available AI player IDs', () => {
      const ids = AIPlayerFactory.getAvailableAIIds();

      expect(ids).toHaveLength(3);
      expect(ids).toContain('random');
      expect(ids).toContain('strategic');
      expect(ids).toContain('minimax');
    });
  });

  describe('integration with GameEngine', () => {
    it('should work with GameEngine factory methods', () => {
      // Test that the GameEngine can create games with the factory
      const humanVsRandom = GameEngine.createHumanVsRandomAI();
      expect(humanVsRandom).toBeDefined();

      const humanVsStrategic = GameEngine.createHumanVsStrategicAI();
      expect(humanVsStrategic).toBeDefined();

      const randomVsStrategic = GameEngine.createRandomAIVsStrategicAI();
      expect(randomVsStrategic).toBeDefined();
    });

    it('should work with new GameEngine factory methods', () => {
      const humanVsAI = GameEngine.createHumanVsAI('strategic');
      expect(humanVsAI).toBeDefined();

      const aiVsAI = GameEngine.createAIVsAI('random', 'strategic');
      expect(aiVsAI).toBeDefined();
    });
  });
});
