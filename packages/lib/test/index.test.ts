import { describe, it, expect } from 'vitest';
import {
  // Type imports
  type PlayerType,
  type CellValue,
  type GameStatus,
  type Position,
  type GridPosition,
  // Core game classes
  GameBoard,
  GameState,
  GameEngine,
  MoveAnalyzer,
  ActionSpaceAnalyzer,
  // Player classes
  Player,
  HumanPlayer,
  RandomAIPlayer,
  StrategicAIPlayer,
  // Utility classes
  CoordinateSystem,
} from '../src/index.js';

describe('Library Exports', () => {
  describe('Core Game Classes', () => {
    it('should export GameBoard class', () => {
      expect(GameBoard).toBeDefined();
      const board = new GameBoard();
      expect(board).toBeInstanceOf(GameBoard);
    });

    it('should export GameState class', () => {
      expect(GameState).toBeDefined();
      const state = new GameState();
      expect(state).toBeInstanceOf(GameState);
    });

    it('should export GameEngine class', () => {
      expect(GameEngine).toBeDefined();
      const playerX = new RandomAIPlayer('X', 'Random X');
      const playerO = new RandomAIPlayer('O', 'Random O');
      const engine = new GameEngine(playerX, playerO);
      expect(engine).toBeInstanceOf(GameEngine);
    });

    it('should export MoveAnalyzer class', () => {
      expect(MoveAnalyzer).toBeDefined();
      const analyzer = new MoveAnalyzer();
      expect(analyzer).toBeInstanceOf(MoveAnalyzer);
    });

    it('should export ActionSpaceAnalyzer class', () => {
      expect(ActionSpaceAnalyzer).toBeDefined();
      const analyzer = new ActionSpaceAnalyzer();
      expect(analyzer).toBeInstanceOf(ActionSpaceAnalyzer);
    });
  });

  describe('Player Classes', () => {
    it('should export Player abstract class', () => {
      expect(Player).toBeDefined();
    });

    it('should export HumanPlayer class', () => {
      expect(HumanPlayer).toBeDefined();
      const player = new HumanPlayer('X', 'Human Player');
      expect(player).toBeInstanceOf(HumanPlayer);
      expect(player).toBeInstanceOf(Player);
    });

    it('should export RandomAIPlayer class', () => {
      expect(RandomAIPlayer).toBeDefined();
      const player = new RandomAIPlayer('O', 'Random AI');
      expect(player).toBeInstanceOf(RandomAIPlayer);
      expect(player).toBeInstanceOf(Player);
    });

    it('should export StrategicAIPlayer class', () => {
      expect(StrategicAIPlayer).toBeDefined();
      const player = new StrategicAIPlayer('X', 'Strategic AI');
      expect(player).toBeInstanceOf(StrategicAIPlayer);
      expect(player).toBeInstanceOf(Player);
    });
  });

  describe('Utility Classes', () => {
    it('should export CoordinateSystem class', () => {
      expect(CoordinateSystem).toBeDefined();
      const coordinates = new CoordinateSystem();
      expect(coordinates).toBeInstanceOf(CoordinateSystem);
    });
  });

  describe('Type Definitions', () => {
    it('should support PlayerType', () => {
      const playerX: PlayerType = 'X';
      const playerO: PlayerType = 'O';
      expect(playerX).toBe('X');
      expect(playerO).toBe('O');
    });

    it('should support CellValue', () => {
      const emptyCell: CellValue = null;
      const xCell: CellValue = 'X';
      const oCell: CellValue = 'O';
      expect(emptyCell).toBeNull();
      expect(xCell).toBe('X');
      expect(oCell).toBe('O');
    });

    it('should support GameStatus', () => {
      const playing: GameStatus = 'playing';
      const won: GameStatus = 'won';
      const draw: GameStatus = 'draw';
      expect(playing).toBe('playing');
      expect(won).toBe('won');
      expect(draw).toBe('draw');
    });

    it('should support Position interface', () => {
      const position: Position = { row: 1, col: 1 };
      expect(position.row).toBe(1);
      expect(position.col).toBe(1);
    });

    it('should support GridPosition interface', () => {
      const gridPosition: GridPosition = { letter: 'B', number: 2 };
      expect(gridPosition.letter).toBe('B');
      expect(gridPosition.number).toBe(2);
    });
  });

  describe('Integration Test', () => {
    it('should allow creating a complete game setup', () => {
      // Create players
      const playerX = new StrategicAIPlayer('X', 'Strategic X');
      const playerO = new RandomAIPlayer('O', 'Random O');

      // Create game engine
      const engine = new GameEngine(playerX, playerO);

      // Get initial state
      const state = engine.getGameState();

      // Verify game is properly initialized
      expect(state.currentPlayer).toBe('X');
      expect(state.status).toBe('playing');
      expect(state.turnNumber).toBe(0);
      expect(state.moves).toHaveLength(0);
    });
  });
});
