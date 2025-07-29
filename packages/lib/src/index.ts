// Type Definitions
export type {
  Player as PlayerType,
  CellValue,
  GameStatus,
  Position,
  GridPosition,
  GameMove,
  GameState as GameStateType,
  MoveAnalysis,
} from './types/game.js';

// Core Game Classes
export { GameBoard } from './game/game-board.js';
export { GameState } from './game/game-state.js';
export { GameEngine } from './game/game-engine.js';
export { MoveAnalyzer } from './game/move-analyzer.js';
export { ActionSpaceAnalyzer } from './game/action-space.js';

// Player Classes
export { Player } from './players/player.js';
export { HumanPlayer } from './players/human-player.js';
export { RandomAIPlayer } from './players/random-ai-player.js';
export { StrategicAIPlayer } from './players/strategic-ai-player.js';

// Utility Classes
export { CoordinateSystem } from './utils/coordinate-system.js';
