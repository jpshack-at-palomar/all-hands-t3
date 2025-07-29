# Tic-Tac-Toe Game Model Contracts

## Overview

This document describes the key classes and interfaces for the tic-tac-toe game model library. It serves as the primary API reference for CLI tools, web applications, and other components that need to interact with the game model.

The library provides a pure, framework-agnostic game model with no UI dependencies, making it suitable for use in various contexts including command-line interfaces, web applications, and automated testing.

## Core Types and Interfaces

### Game Types

```typescript
// Core game types
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';

// Position representations
export interface Position {
  row: number; // 0-2 (internal representation)
  col: number; // 0-2 (internal representation)
}

export interface GridPosition {
  letter: string; // 'A', 'B', 'C' (user-facing)
  number: number; // 1, 2, 3 (user-facing)
}

// Game state and moves
export interface GameMove {
  player: Player;
  position: Position;
  gridPosition: GridPosition;
  timestamp: number;
}

export interface GameState {
  board: CellValue[][];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  moves: GameMove[];
  turnNumber: number;
}

// Move analysis for AI and strategy
export interface MoveAnalysis {
  position: Position;
  gridPosition: GridPosition;
  winInTurns: number | null; // null if no win possible
  blocksOpponentWin: boolean;
  createsFork: boolean;
  blocksOpponentFork: boolean;
}

// Action space analysis
export interface ActionSpace {
  availableMoves: Position[];
  totalMoves: number;
  strategicMoves: MoveAnalysis[];
  bestMove: Position | null;
  gamePhase: 'opening' | 'midgame' | 'endgame';
}
```

## Core Classes

### GameBoard

The `GameBoard` class represents the 3x3 game board and provides methods for board manipulation and coordinate conversion.

```typescript
export class GameBoard {
  constructor();

  // Core board operations
  getCell(position: Position): CellValue;
  setCell(position: Position, value: CellValue): void;
  isEmpty(position: Position): boolean;
  getEmptyPositions(): Position[];
  isFull(): boolean;
  getBoard(): CellValue[][];
  reset(): void;

  // Coordinate conversion
  positionToGrid(position: Position): GridPosition;
  gridToPosition(grid: GridPosition): Position;
  isValidGridPosition(grid: GridPosition): boolean;
}
```

**Usage Examples:**

```typescript
import { GameBoard } from '@pnpm-template/lib';

const board = new GameBoard();

// Make a move using internal coordinates
board.setCell({ row: 0, col: 0 }, 'X');

// Convert to user-facing grid coordinates
const gridPos = board.positionToGrid({ row: 0, col: 0 });
console.log(gridPos); // { letter: 'A', number: 1 }

// Convert from grid coordinates
const pos = board.gridToPosition({ letter: 'B', number: 2 });
console.log(pos); // { row: 1, col: 1 }
```

### GameState

The `GameState` class manages the complete game state including the board, current player, game status, and move history.

```typescript
export class GameState {
  constructor();

  // State management
  getState(): GameState;
  makeMove(position: Position): boolean;
  reset(): void;

  // Move analysis
  getAvailableMoves(): Position[];
  getMoveAnalysis(): MoveAnalysis[];
  getBestMoves(): MoveAnalysis[];

  // Game information
  getHistory(): string;
}
```

**Usage Examples:**

```typescript
import { GameState } from '@pnpm-template/lib';

const gameState = new GameState();

// Make a move
const success = gameState.makeMove({ row: 0, col: 0 });
if (success) {
  console.log('Move successful');
}

// Get current state
const state = gameState.getState();
console.log(`Current player: ${state.currentPlayer}`);
console.log(`Game status: ${state.status}`);

// Get available moves
const moves = gameState.getAvailableMoves();
console.log(`Available moves: ${moves.length}`);

// Get move analysis for AI
const analysis = gameState.getMoveAnalysis();
const bestMoves = gameState.getBestMoves();
```

### GameEngine

The `GameEngine` class coordinates the game flow and manages player interactions. It serves as the main entry point for game operations.

```typescript
export class GameEngine {
  constructor(playerX: Player, playerO: Player);

  // Game flow
  getGameState(): GameState;
  makeMove(): Promise<boolean>;
  makeMoveAt(position: Position): boolean;

  // Game analysis
  getAvailableMoves(): Position[];
  getMoveAnalysis(): MoveAnalysis[];
  getBestMoves(): MoveAnalysis[];

  // Game status
  isGameOver(): boolean;
  getWinner(): Player | null;
  reset(): void;
  getHistory(): string;

  // Factory methods for common game types
  static createHumanVsHuman(): GameEngine;
  static createHumanVsRandomAI(): GameEngine;
  static createHumanVsStrategicAI(): GameEngine;
  static createRandomAIVsStrategicAI(): GameEngine;
}
```

**Usage Examples:**

```typescript
import { GameEngine, HumanPlayer, RandomAIPlayer } from '@pnpm-template/lib';

// Create a human vs AI game
const game = GameEngine.createHumanVsRandomAI();

// Make a move for the current player (AI will move automatically)
await game.makeMove();

// Make a specific move (for human players)
game.makeMoveAt({ row: 1, col: 1 });

// Check game status
if (game.isGameOver()) {
  const winner = game.getWinner();
  console.log(`Game over! Winner: ${winner || 'Draw'}`);
}

// Get game history
console.log(game.getHistory()); // "X: A1, O: B2, X: C3"
```

## Player System

### Player Interface

All players implement the `Player` interface, which provides a consistent API for both human and AI players.

```typescript
export abstract class Player {
  abstract readonly symbol: Player;
  abstract readonly name: string;

  abstract getMove(gameState: GameState): Promise<Position>;

  // Optional: For AI players to provide move analysis
  analyzeMove?(gameState: GameState, position: Position): MoveAnalysis;
}
```

### HumanPlayer

The `HumanPlayer` class represents a human player. It requires UI integration to get moves from the user.

```typescript
export class HumanPlayer extends Player {
  constructor(symbol: Player, name?: string);

  readonly symbol: Player;
  readonly name: string;

  async getMove(gameState: GameState): Promise<Position>;
}
```

**Usage Examples:**

```typescript
import { HumanPlayer } from '@pnpm-template/lib';

const humanPlayer = new HumanPlayer('X', 'Alice');

// Note: getMove will throw an error if not integrated with UI
// This is intentional - human players require UI implementation
try {
  const move = await humanPlayer.getMove(gameState);
} catch (error) {
  console.log('Human player requires UI integration');
}
```

### RandomAIPlayer

The `RandomAIPlayer` makes random moves from available positions.

```typescript
export class RandomAIPlayer extends Player {
  constructor(symbol: Player, name?: string);

  readonly symbol: Player;
  readonly name: string;

  async getMove(gameState: GameState): Promise<Position>;
}
```

**Usage Examples:**

```typescript
import { RandomAIPlayer } from '@pnpm-template/lib';

const randomAI = new RandomAIPlayer('O', 'Random Bot');

// Get a random move
const move = await randomAI.getMove(gameState);
console.log(`Random AI chose: ${move.row}, ${move.col}`);
```

### StrategicAIPlayer

The `StrategicAIPlayer` uses move analysis to make strategic decisions.

```typescript
export class StrategicAIPlayer extends Player {
  constructor(symbol: Player, name?: string);

  readonly symbol: Player;
  readonly name: string;

  async getMove(gameState: GameState): Promise<Position>;
  analyzeMove(gameState: GameState, position: Position): MoveAnalysis;
}
```

**Usage Examples:**

```typescript
import { StrategicAIPlayer } from '@pnpm-template/lib';

const strategicAI = new StrategicAIPlayer('O', 'Strategic Bot');

// Get a strategic move
const move = await strategicAI.getMove(gameState);
console.log(`Strategic AI chose: ${move.row}, ${move.col}`);

// Analyze a specific move
const analysis = strategicAI.analyzeMove(gameState, { row: 0, col: 0 });
console.log(`Move analysis:`, analysis);
```

## Move Analysis System

### MoveAnalyzer

The `MoveAnalyzer` class provides comprehensive move analysis for strategic decision-making.

```typescript
export class MoveAnalyzer {
  constructor();

  // Core analysis methods
  analyzeMoves(gameState: GameState): MoveAnalysis[];
  analyzeMove(gameState: GameState, position: Position): MoveAnalysis;
  checkWinner(board: CellValue[][]): Player | null;
}
```

**Usage Examples:**

```typescript
import { MoveAnalyzer } from '@pnpm-template/lib';

const analyzer = new MoveAnalyzer();

// Analyze all available moves
const analysis = analyzer.analyzeMoves(gameState);

// Find winning moves
const winningMoves = analysis.filter((move) => move.winInTurns !== null);
console.log(`Winning moves: ${winningMoves.length}`);

// Find blocking moves
const blockingMoves = analysis.filter((move) => move.blocksOpponentWin);
console.log(`Blocking moves: ${blockingMoves.length}`);

// Check for winner
const winner = analyzer.checkWinner(gameState.board);
if (winner) {
  console.log(`Winner: ${winner}`);
}
```

## Action Space Analysis

### ActionSpaceAnalyzer

The `ActionSpaceAnalyzer` provides comprehensive analysis of the current action space.

```typescript
export class ActionSpaceAnalyzer {
  constructor();

  // Core analysis methods
  getActionSpace(gameState: GameState): ActionSpace;
  getAvailableMoves(gameState: GameState): Position[];
  getActionSpaceWithGrid(
    gameState: GameState
  ): Array<Position & { gridPosition: GridPosition }>;
  getStrategicActionSpace(
    gameState: GameState,
    criteria: 'winning' | 'blocking' | 'forking' | 'all'
  ): Position[];
  getActionSpaceStats(gameState: GameState): {
    totalMoves: number;
    winningMoves: number;
    blockingMoves: number;
    forkingMoves: number;
    neutralMoves: number;
  };
}
```

**Usage Examples:**

```typescript
import { ActionSpaceAnalyzer } from '@pnpm-template/lib';

const analyzer = new ActionSpaceAnalyzer();

// Get complete action space
const actionSpace = analyzer.getActionSpace(gameState);
console.log(`Game phase: ${actionSpace.gamePhase}`);
console.log(`Total moves: ${actionSpace.totalMoves}`);
console.log(`Best move: ${actionSpace.bestMove}`);

// Get strategic moves
const winningMoves = analyzer.getStrategicActionSpace(gameState, 'winning');
const blockingMoves = analyzer.getStrategicActionSpace(gameState, 'blocking');

// Get statistics
const stats = analyzer.getActionSpaceStats(gameState);
console.log(`Winning moves: ${stats.winningMoves}`);
console.log(`Blocking moves: ${stats.blockingMoves}`);
```

## Coordinate System Utilities

### CoordinateSystem

The `CoordinateSystem` class provides utilities for coordinate conversion and validation.

```typescript
export class CoordinateSystem {
  // Coordinate conversion
  static positionToGrid(position: Position): GridPosition;
  static gridToPosition(grid: GridPosition): Position;
  static isValidGridPosition(grid: GridPosition): boolean;

  // String parsing and formatting
  static parseGridString(gridString: string): GridPosition | null;
  static formatPosition(position: Position): string;

  // Utility methods
  static getAllGridPositions(): GridPosition[];
}
```

**Usage Examples:**

```typescript
import { CoordinateSystem } from '@pnpm-template/lib';

// Convert coordinates
const grid = CoordinateSystem.positionToGrid({ row: 0, col: 1 });
console.log(grid); // { letter: 'B', number: 1 }

const pos = CoordinateSystem.gridToPosition({ letter: 'C', number: 3 });
console.log(pos); // { row: 2, col: 2 }

// Parse grid strings
const parsed = CoordinateSystem.parseGridString('A1');
console.log(parsed); // { letter: 'A', number: 1 }

// Format positions
const formatted = CoordinateSystem.formatPosition({ row: 1, col: 2 });
console.log(formatted); // 'C2'

// Validate coordinates
const isValid = CoordinateSystem.isValidGridPosition({
  letter: 'D',
  number: 4,
});
console.log(isValid); // false
```

## CLI Integration Examples

### Basic CLI Game

```typescript
import { GameEngine, HumanPlayer, RandomAIPlayer } from '@pnpm-template/lib';

async function playCLIGame() {
  const game = GameEngine.createHumanVsRandomAI();

  while (!game.isGameOver()) {
    const state = game.getGameState();

    // Display board
    displayBoard(state.board);

    if (state.currentPlayer === 'X') {
      // Human turn
      const move = await getHumanMove(game);
      game.makeMoveAt(move);
    } else {
      // AI turn
      await game.makeMove();
    }
  }

  // Display final result
  const winner = game.getWinner();
  console.log(`Game over! Winner: ${winner || 'Draw'}`);
}

function displayBoard(board: CellValue[][]) {
  console.log('   A B C');
  for (let row = 0; row < 3; row++) {
    console.log(
      `${row + 1}  ${board[row].map((cell) => cell || ' ').join(' ')}`
    );
  }
}

async function getHumanMove(game: GameEngine): Promise<Position> {
  const moves = game.getAvailableMoves();
  console.log(
    'Available moves:',
    moves.map((m) => CoordinateSystem.formatPosition(m)).join(', ')
  );

  // Implementation would read from stdin
  // For now, return first available move
  return moves[0];
}
```

### AI vs AI Simulation

```typescript
import {
  GameEngine,
  RandomAIPlayer,
  StrategicAIPlayer,
} from '@pnpm-template/lib';

async function simulateAIGame() {
  const game = GameEngine.createRandomAIVsStrategicAI();

  while (!game.isGameOver()) {
    await game.makeMove();

    // Optional: Display progress
    const state = game.getGameState();
    console.log(
      `Turn ${state.turnNumber}: ${state.currentPlayer === 'X' ? 'Random AI' : 'Strategic AI'}`
    );
  }

  const winner = game.getWinner();
  console.log(`Winner: ${winner || 'Draw'}`);
  console.log(`Game history: ${game.getHistory()}`);
}
```

### Move Analysis CLI Tool

```typescript
import { GameState, MoveAnalyzer } from '@pnpm-template/lib';

function analyzePosition(boardState: string) {
  const gameState = new GameState();

  // Parse board state and make moves
  // Implementation would parse the board string
  // and reconstruct the game state

  const analyzer = new MoveAnalyzer();
  const analysis = analyzer.analyzeMoves(gameState.getState());

  console.log('Move Analysis:');
  analysis.forEach((move) => {
    const gridPos = CoordinateSystem.formatPosition(move.position);
    console.log(
      `${gridPos}: ${move.winInTurns ? `Win in ${move.winInTurns} turns` : 'No win'}`
    );
    if (move.blocksOpponentWin) console.log('  - Blocks opponent win');
    if (move.createsFork) console.log('  - Creates fork');
  });
}
```

## Error Handling

The library provides comprehensive error handling for common scenarios:

### Invalid Moves

```typescript
// Attempting to make a move on an occupied cell
const success = gameState.makeMove({ row: 0, col: 0 });
if (!success) {
  console.log('Invalid move: Position already occupied');
}
```

### Game Over Conditions

```typescript
// Attempting to make a move when game is over
if (gameState.getState().status !== 'playing') {
  console.log('Game is already over');
  return;
}
```

### AI Player Errors

```typescript
// AI player with no available moves
try {
  const move = await aiPlayer.getMove(gameState);
} catch (error) {
  console.log('No available moves for AI player');
}
```

## Performance Considerations

### Move Analysis Performance

- **Time Complexity**: O(n) where n is the number of empty positions
- **Space Complexity**: O(n) for storing move analysis results
- **Optimization**: Analysis is cached during game state updates

### Memory Usage

- **Game State**: Minimal memory footprint (~1KB per game)
- **Move History**: Linear growth with game length
- **Analysis Results**: Temporary storage, garbage collected after use

### Scalability

- **Single Game**: Optimized for real-time play
- **Multiple Games**: Can run multiple concurrent games
- **AI Training**: Suitable for generating training data

## Type Safety

All classes and interfaces are fully typed with TypeScript, providing:

- **Compile-time error checking**
- **IntelliSense support**
- **Refactoring safety**
- **API documentation through types**

## Testing Support

The library is designed for comprehensive testing:

```typescript
import { GameState, MoveAnalyzer } from '@pnpm-template/lib';

// Test game scenarios
function testGameScenario() {
  const gameState = new GameState();

  // Make specific moves to test scenarios
  gameState.makeMove({ row: 0, col: 0 }); // X
  gameState.makeMove({ row: 1, col: 1 }); // O
  gameState.makeMove({ row: 0, col: 1 }); // X

  // Test analysis
  const analyzer = new MoveAnalyzer();
  const analysis = analyzer.analyzeMoves(gameState.getState());

  // Assert expected results
  return analysis;
}
```

## Integration Guidelines

### For CLI Applications

1. Use `GameEngine` as the main entry point
2. Implement human move input through `makeMoveAt()`
3. Use `getAvailableMoves()` for move validation
4. Use `getMoveAnalysis()` for hints and AI assistance

### For Web Applications

1. Use `GameState` for state management
2. Implement `HumanPlayer` with UI callbacks
3. Use `getActionSpace()` for UI updates
4. Use coordinate conversion for user input

### For AI Applications

1. Use `MoveAnalyzer` for strategic analysis
2. Implement custom AI players extending `Player`
3. Use `getBestMoves()` for move selection
4. Use `ActionSpaceAnalyzer` for comprehensive analysis

### For Testing Applications

1. Use `GameState` for scenario setup
2. Use `MoveAnalyzer` for result validation
3. Use coordinate utilities for test data
4. Use factory methods for common scenarios

## Version Compatibility

The library maintains backward compatibility within major versions:

- **API Stability**: Public interfaces remain stable
- **Type Safety**: Type definitions are versioned
- **Migration Path**: Clear upgrade paths between versions
- **Deprecation Policy**: Gradual deprecation with alternatives

## Conclusion

This contracts document provides a comprehensive reference for integrating the tic-tac-toe game model into various applications. The library's pure, framework-agnostic design makes it suitable for CLI tools, web applications, AI research, and automated testing.

For additional examples and advanced usage patterns, refer to the test suite and integration examples in the library source code.
