# Tic-Tac-Toe Game Model Library Design

## 1. Introduction

### 1.1. Problem Statement

We need to build a reusable, pure model library for a tic-tac-toe game that can
be incorporated into various projects. The model should be completely separate
from display logic and provide a clean API for game state management, move
validation, AI players, and game analysis. The library should support different
types of players (human, AI) and provide utilities for analyzing available moves
and determining optimal strategies.

### 1.2. Proposed Solution

This document outlines the design for a comprehensive tic-tac-toe game model
library that provides:

- **Pure Game Logic**: No UI dependencies, just the core game model
- **Flexible Player System**: Support for human players and various AI
  strategies
- **Grid Coordinate System**: Letters for columns (A-C), numbers for rows (1-3)
- **Move Analysis Engine**: Rank moves by win potential (1 turn, 2 turns, 3
  turns)
- **Game State Management**: Board representation, turn history, win detection
- **Extensible Architecture**: Easy to add new AI players and game variants

The library will be built as a TypeScript package with comprehensive testing
using Vitest, following modern development practices and ensuring high code
quality.

### 1.3. Quality Standards

To ensure consistent, high-quality implementations, all code must follow these
established standards:

#### 1.3.1. Framework Requirements

All implementations must use the established framework:

- **TypeScript:** Strict typing with comprehensive type definitions
- **ES Modules:** Use ES module imports/exports
- **Vitest:** Comprehensive testing framework
- **Clean Architecture:** Separation of concerns and pure functions
- **Error Handling:** Proper error handling with user-friendly messages

#### 1.3.2. Quality Standards

- **No UI Dependencies:** Pure model logic only
- **Comprehensive Testing:** Unit tests for all components
- **Type Safety:** Full TypeScript coverage
- **Documentation:** Clear API documentation and usage examples
- **Performance:** Efficient algorithms and data structures
- **Extensibility:** Easy to add new features and AI players

### 1.4. Scope

#### 1.4.1. In Scope for Initial Implementation

- **Core Game Model**: Board representation, game state, turn management
- **Player System**: Abstract player interface with human and AI implementations
- **Grid System**: Coordinate system with letters/numbers (A1, B2, etc.)
- **Move Analysis**: Available moves calculation and ranking
- **AI Players**: Random player and strategic player implementations
- **Game Engine**: Main game controller and state management
- **TypeScript Types**: Comprehensive type definitions
- **Unit Tests**: Complete test coverage with Vitest
- **Documentation**: API documentation and usage examples

#### 1.4.2. Out of Scope for Initial Implementation

- **UI Components**: No display logic or rendering
- **Network Multiplayer**: No real-time networking
- **Advanced AI**: No minimax or complex game tree algorithms initially
- **Game Variants**: No 4x4 or other board sizes initially
- **Persistence**: No save/load functionality initially
- **Tournament System**: No bracket management or scoring

## 2. Design and Implementation

### 2.1. Overview

The implementation consists of these key components:

1. **Game Board**: 3x3 grid representation with coordinate system
2. **Game State**: Current player, game status, turn history
3. **Player System**: Abstract player interface with concrete implementations
4. **Move Analysis**: Utilities for analyzing available moves and win potential
5. **Game Engine**: Main controller for game flow and state management
6. **AI Players**: Random and strategic AI implementations
7. **Coordinate System**: Letter/number grid system (A1, B2, C3, etc.)
8. **Type Definitions**: Comprehensive TypeScript types

### 2.1.1. Current Implementation Status

**To Be Implemented:**

- ❌ `GameBoard` - 3x3 grid representation
- ❌ `GameState` - Game state management
- ❌ `Player` - Abstract player interface
- ❌ `HumanPlayer` - Human player implementation
- ❌ `RandomAIPlayer` - Random AI player
- ❌ `StrategicAIPlayer` - Strategic AI player
- ❌ `GameEngine` - Main game controller
- ❌ `MoveAnalyzer` - Move analysis utilities
- ❌ `CoordinateSystem` - Grid coordinate utilities
- ❌ `GameTypes` - TypeScript type definitions

### 2.2. Core Data Structures

#### 2.2.1. Game Types

```typescript
// packages/lib/src/types/game.ts
export type Player = 'X' | 'O';
export type CellValue = Player | null;
export type GameStatus = 'playing' | 'won' | 'draw';

export interface Position {
  row: number; // 0-2
  col: number; // 0-2
}

export interface GridPosition {
  letter: string; // 'A', 'B', 'C'
  number: number; // 1, 2, 3
}

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

export interface MoveAnalysis {
  position: Position;
  gridPosition: GridPosition;
  winInTurns: number | null; // null if no win possible
  blocksOpponentWin: boolean;
  createsFork: boolean;
  blocksOpponentFork: boolean;
}
```

#### 2.2.2. Player Interface

```typescript
// packages/lib/src/players/player.ts
export interface Player {
  readonly symbol: Player;
  readonly name: string;

  getMove(gameState: GameState): Promise<Position>;

  // Optional: For AI players to provide move analysis
  analyzeMove?(gameState: GameState, position: Position): MoveAnalysis;
}
```

### 2.3. Game Board Implementation

#### 2.3.1. GameBoard Class

```typescript
// packages/lib/src/game/game-board.ts
import { Position, CellValue, GridPosition } from '../types/game.js';

export class GameBoard {
  private board: CellValue[][];

  constructor() {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  /**
   * Get the value at a specific position
   */
  getCell(position: Position): CellValue {
    return this.board[position.row][position.col];
  }

  /**
   * Set the value at a specific position
   */
  setCell(position: Position, value: CellValue): void {
    this.board[position.row][position.col] = value;
  }

  /**
   * Check if a position is empty
   */
  isEmpty(position: Position): boolean {
    return this.getCell(position) === null;
  }

  /**
   * Get all empty positions
   */
  getEmptyPositions(): Position[] {
    const empty: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.isEmpty({ row, col })) {
          empty.push({ row, col });
        }
      }
    }
    return empty;
  }

  /**
   * Check if the board is full
   */
  isFull(): boolean {
    return this.getEmptyPositions().length === 0;
  }

  /**
   * Get a copy of the current board state
   */
  getBoard(): CellValue[][] {
    return this.board.map((row) => [...row]);
  }

  /**
   * Reset the board to empty state
   */
  reset(): void {
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

  /**
   * Convert position to grid coordinates
   */
  positionToGrid(position: Position): GridPosition {
    const letters = ['A', 'B', 'C'];
    return {
      letter: letters[position.col],
      number: position.row + 1,
    };
  }

  /**
   * Convert grid coordinates to position
   */
  gridToPosition(grid: GridPosition): Position {
    const letters = ['A', 'B', 'C'];
    return {
      row: grid.number - 1,
      col: letters.indexOf(grid.letter),
    };
  }

  /**
   * Validate grid coordinates
   */
  isValidGridPosition(grid: GridPosition): boolean {
    const letters = ['A', 'B', 'C'];
    return (
      letters.includes(grid.letter) && grid.number >= 1 && grid.number <= 3
    );
  }
}
```

### 2.4. Game State Management

#### 2.4.1. GameState Class

```typescript
// packages/lib/src/game/game-state.ts
import {
  GameState as GameStateType,
  Player,
  Position,
  GameMove,
  GameStatus,
} from '../types/game.js';
import { GameBoard } from './game-board.js';
import { MoveAnalyzer } from './move-analyzer.js';

export class GameState {
  private state: GameStateType;
  private board: GameBoard;
  private moveAnalyzer: MoveAnalyzer;

  constructor() {
    this.board = new GameBoard();
    this.moveAnalyzer = new MoveAnalyzer();
    this.state = {
      board: this.board.getBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    };
  }

  /**
   * Get current game state
   */
  getState(): GameStateType {
    return { ...this.state };
  }

  /**
   * Make a move at the specified position
   */
  makeMove(position: Position): boolean {
    if (this.state.status !== 'playing') {
      return false;
    }

    if (!this.board.isEmpty(position)) {
      return false;
    }

    // Make the move
    this.board.setCell(position, this.state.currentPlayer);

    // Create move record
    const move: GameMove = {
      player: this.state.currentPlayer,
      position,
      gridPosition: this.board.positionToGrid(position),
      timestamp: Date.now(),
    };

    // Update state
    this.state.board = this.board.getBoard();
    this.state.moves.push(move);
    this.state.turnNumber++;

    // Check for win or draw
    this.checkGameEnd();

    // Switch players
    if (this.state.status === 'playing') {
      this.state.currentPlayer = this.state.currentPlayer === 'X' ? 'O' : 'X';
    }

    return true;
  }

  /**
   * Check if the game has ended (win or draw)
   */
  private checkGameEnd(): void {
    const winner = this.moveAnalyzer.checkWinner(this.state.board);

    if (winner) {
      this.state.status = 'won';
      this.state.winner = winner;
    } else if (this.board.isFull()) {
      this.state.status = 'draw';
    }
  }

  /**
   * Get available moves for the current player
   */
  getAvailableMoves(): Position[] {
    return this.board.getEmptyPositions();
  }

  /**
   * Get move analysis for all available moves
   */
  getMoveAnalysis(): MoveAnalysis[] {
    return this.moveAnalyzer.analyzeMoves(this.state);
  }

  /**
   * Get the best moves ranked by win potential
   */
  getBestMoves(): MoveAnalysis[] {
    const analysis = this.getMoveAnalysis();
    return analysis.sort((a, b) => {
      // Sort by win potential (lower is better)
      const aWin = a.winInTurns ?? Infinity;
      const bWin = b.winInTurns ?? Infinity;

      if (aWin !== bWin) {
        return aWin - bWin;
      }

      // Then by other strategic factors
      if (a.blocksOpponentWin !== b.blocksOpponentWin) {
        return b.blocksOpponentWin ? 1 : -1;
      }

      if (a.createsFork !== b.createsFork) {
        return b.createsFork ? 1 : -1;
      }

      return 0;
    });
  }

  /**
   * Reset the game to initial state
   */
  reset(): void {
    this.board.reset();
    this.state = {
      board: this.board.getBoard(),
      currentPlayer: 'X',
      status: 'playing',
      winner: null,
      moves: [],
      turnNumber: 0,
    };
  }

  /**
   * Get game history as a string
   */
  getHistory(): string {
    return this.state.moves
      .map(
        (move) =>
          `${move.player}: ${move.gridPosition.letter}${move.gridPosition.number}`
      )
      .join(', ');
  }
}
```

### 2.5. Player System

#### 2.5.1. Abstract Player Class

```typescript
// packages/lib/src/players/player.ts
import {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
} from '../types/game.js';

export abstract class Player {
  abstract readonly symbol: PlayerType;
  abstract readonly name: string;

  abstract getMove(gameState: GameStateType): Promise<Position>;

  /**
   * Optional: For AI players to provide move analysis
   */
  analyzeMove?(gameState: GameStateType, position: Position): MoveAnalysis {
    return null;
  }
}
```

#### 2.5.2. Human Player

```typescript
// packages/lib/src/players/human-player.ts
import { Player } from './player.js';
import {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
} from '../types/game.js';

export class HumanPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;

  constructor(symbol: PlayerType, name: string = 'Human') {
    super();
    this.symbol = symbol;
    this.name = name;
  }

  async getMove(gameState: GameStateType): Promise<Position> {
    // This would be implemented by the UI layer
    // For now, we'll throw an error indicating UI is needed
    throw new Error('Human player requires UI implementation');
  }
}
```

#### 2.5.3. Random AI Player

```typescript
// packages/lib/src/players/random-ai-player.ts
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
    );

    if (availableMoves.length === 0) {
      throw new Error('No available moves');
    }

    // Pick a random available move
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }
}
```

#### 2.5.4. Strategic AI Player

```typescript
// packages/lib/src/players/strategic-ai-player.ts
import { Player } from './player.js';
import {
  Player as PlayerType,
  Position,
  GameState as GameStateType,
  MoveAnalysis,
} from '../types/game.js';
import { MoveAnalyzer } from '../game/move-analyzer.js';

export class StrategicAIPlayer extends Player {
  readonly symbol: PlayerType;
  readonly name: string;
  private moveAnalyzer: MoveAnalyzer;

  constructor(symbol: PlayerType, name: string = 'Strategic AI') {
    super();
    this.symbol = symbol;
    this.name = name;
    this.moveAnalyzer = new MoveAnalyzer();
  }

  async getMove(gameState: GameStateType): Promise<Position> {
    const analysis = this.moveAnalyzer.analyzeMoves(gameState);

    if (analysis.length === 0) {
      throw new Error('No available moves');
    }

    // Find the best move
    const bestMove = analysis.reduce((best, current) => {
      // Prioritize winning moves
      if (
        current.winInTurns !== null &&
        (best.winInTurns === null || current.winInTurns < best.winInTurns)
      ) {
        return current;
      }

      // Then blocking moves
      if (current.blocksOpponentWin && !best.blocksOpponentWin) {
        return current;
      }

      // Then fork creation
      if (current.createsFork && !best.createsFork) {
        return current;
      }

      // Then fork blocking
      if (current.blocksOpponentFork && !best.blocksOpponentFork) {
        return current;
      }

      return best;
    });

    return bestMove.position;
  }

  analyzeMove(gameState: GameStateType, position: Position): MoveAnalysis {
    return this.moveAnalyzer.analyzeMove(gameState, position);
  }
}
```

### 2.6. Move Analysis Engine

#### 2.6.1. MoveAnalyzer Class

```typescript
// packages/lib/src/game/move-analyzer.ts
import {
  Player,
  Position,
  GameState as GameStateType,
  MoveAnalysis,
  CellValue,
} from '../types/game.js';

export class MoveAnalyzer {
  /**
   * Analyze all available moves for the current game state
   */
  analyzeMoves(gameState: GameStateType): MoveAnalysis[] {
    const availableMoves: Position[] = [];

    // Find all empty positions
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState.board[row][col] === null) {
          availableMoves.push({ row, col });
        }
      }
    }

    return availableMoves.map((position) =>
      this.analyzeMove(gameState, position)
    );
  }

  /**
   * Analyze a specific move
   */
  analyzeMove(gameState: GameStateType, position: Position): MoveAnalysis {
    const { board, currentPlayer } = gameState;

    // Create a copy of the board with this move
    const testBoard = board.map((row) => [...row]);
    testBoard[position.row][position.col] = currentPlayer;

    // Check if this move wins
    const winInTurns = this.checkWinInTurns(testBoard, currentPlayer);

    // Check if this move blocks opponent's win
    const opponent = currentPlayer === 'X' ? 'O' : 'X';
    const blocksOpponentWin = this.blocksOpponentWin(board, position, opponent);

    // Check for fork creation
    const createsFork = this.createsFork(testBoard, currentPlayer);

    // Check for fork blocking
    const blocksOpponentFork = this.blocksOpponentFork(
      board,
      position,
      opponent
    );

    return {
      position,
      gridPosition: this.positionToGrid(position),
      winInTurns,
      blocksOpponentWin,
      createsFork,
      blocksOpponentFork,
    };
  }

  /**
   * Check if the current player has won
   */
  checkWinner(board: CellValue[][]): Player | null {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][1] === board[row][2]
      ) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[1][col] === board[2][col]
      ) {
        return board[0][col];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return board[0][0];
    }

    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return board[0][2];
    }

    return null;
  }

  /**
   * Check if a move wins in a specific number of turns
   */
  private checkWinInTurns(board: CellValue[][], player: Player): number | null {
    const winner = this.checkWinner(board);
    if (winner === player) {
      return 1; // Immediate win
    }

    // For more complex analysis, we could implement minimax
    // For now, we'll just check immediate wins
    return null;
  }

  /**
   * Check if a move blocks opponent's win
   */
  private blocksOpponentWin(
    board: CellValue[][],
    position: Position,
    opponent: Player
  ): boolean {
    const testBoard = board.map((row) => [...row]);
    testBoard[position.row][position.col] = opponent;

    return this.checkWinner(testBoard) === opponent;
  }

  /**
   * Check if a move creates a fork (two winning opportunities)
   */
  private createsFork(board: CellValue[][], player: Player): boolean {
    // Count how many winning opportunities this move creates
    let winOpportunities = 0;

    // Check rows, columns, and diagonals that include this position
    // This is a simplified implementation
    return winOpportunities >= 2;
  }

  /**
   * Check if a move blocks opponent's fork
   */
  private blocksOpponentFork(
    board: CellValue[][],
    position: Position,
    opponent: Player
  ): boolean {
    // This is a complex analysis that would require checking
    // if the opponent has multiple winning opportunities
    return false;
  }

  /**
   * Convert position to grid coordinates
   */
  private positionToGrid(position: Position): {
    letter: string;
    number: number;
  } {
    const letters = ['A', 'B', 'C'];
    return {
      letter: letters[position.col],
      number: position.row + 1,
    };
  }
}
```

### 2.7. Game Engine

#### 2.7.1. GameEngine Class

```typescript
// packages/lib/src/game/game-engine.ts
import { Player, GameState as GameStateType, Position } from '../types/game.js';
import { GameState } from './game-state.js';
import { Player as PlayerInterface } from '../players/player.js';
import { HumanPlayer } from '../players/human-player.js';
import { RandomAIPlayer } from '../players/random-ai-player.js';
import { StrategicAIPlayer } from '../players/strategic-ai-player.js';

export class GameEngine {
  private gameState: GameState;
  private playerX: PlayerInterface;
  private playerO: PlayerInterface;

  constructor(playerX: PlayerInterface, playerO: PlayerInterface) {
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
  getWinner(): Player | null {
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
```

### 2.8. Action Space Analysis

#### 2.8.1. Action Space Overview

The action space represents all valid moves available to the current player. In
tic-tac-toe, this is simply all empty positions on the board. However, we can
enhance this with strategic analysis to provide more meaningful action space
information.

#### 2.8.2. Basic Action Space

```typescript
// packages/lib/src/game/action-space.ts
import {
  Position,
  GameState as GameStateType,
  MoveAnalysis,
} from '../types/game.js';
import { MoveAnalyzer } from './move-analyzer.js';

export interface ActionSpace {
  availableMoves: Position[];
  totalMoves: number;
  strategicMoves: MoveAnalysis[];
  bestMove: Position | null;
  gamePhase: 'opening' | 'midgame' | 'endgame';
}

export class ActionSpaceAnalyzer {
  private moveAnalyzer: MoveAnalyzer;

  constructor() {
    this.moveAnalyzer = new MoveAnalyzer();
  }

  /**
   * Get the complete action space for the current game state
   */
  getActionSpace(gameState: GameStateType): ActionSpace {
    const availableMoves = this.getAvailableMoves(gameState);
    const strategicMoves = this.moveAnalyzer.analyzeMoves(gameState);
    const bestMove = this.getBestMove(strategicMoves);
    const gamePhase = this.determineGamePhase(gameState);

    return {
      availableMoves,
      totalMoves: availableMoves.length,
      strategicMoves,
      bestMove,
      gamePhase,
    };
  }

  /**
   * Get all available moves (basic action space)
   */
  getAvailableMoves(gameState: GameStateType): Position[] {
    const moves: Position[] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState.board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  /**
   * Get action space with grid coordinates
   */
  getActionSpaceWithGrid(
    gameState: GameStateType
  ): Array<Position & { gridPosition: { letter: string; number: number } }> {
    const moves = this.getAvailableMoves(gameState);
    return moves.map((move) => ({
      ...move,
      gridPosition: {
        letter: ['A', 'B', 'C'][move.col],
        number: move.row + 1,
      },
    }));
  }

  /**
   * Get action space filtered by strategic criteria
   */
  getStrategicActionSpace(
    gameState: GameStateType,
    criteria: 'winning' | 'blocking' | 'forking' | 'all'
  ): Position[] {
    const analysis = this.moveAnalyzer.analyzeMoves(gameState);

    switch (criteria) {
      case 'winning':
        return analysis
          .filter((move) => move.winInTurns !== null)
          .map((move) => move.position);

      case 'blocking':
        return analysis
          .filter((move) => move.blocksOpponentWin)
          .map((move) => move.position);

      case 'forking':
        return analysis
          .filter((move) => move.createsFork)
          .map((move) => move.position);

      case 'all':
      default:
        return analysis.map((move) => move.position);
    }
  }

  /**
   * Get the best move from strategic analysis
   */
  private getBestMove(analysis: MoveAnalysis[]): Position | null {
    if (analysis.length === 0) return null;

    // Find move with highest priority
    return analysis.reduce((best, current) => {
      // Prioritize winning moves
      if (
        current.winInTurns !== null &&
        (best.winInTurns === null || current.winInTurns < best.winInTurns)
      ) {
        return current;
      }

      // Then blocking moves
      if (current.blocksOpponentWin && !best.blocksOpponentWin) {
        return current;
      }

      // Then fork creation
      if (current.createsFork && !best.createsFork) {
        return current;
      }

      return best;
    }).position;
  }

  /**
   * Determine the current game phase
   */
  private determineGamePhase(
    gameState: GameStateType
  ): 'opening' | 'midgame' | 'endgame' {
    const totalMoves = gameState.board
      .flat()
      .filter((cell) => cell !== null).length;

    if (totalMoves <= 2) return 'opening';
    if (totalMoves <= 6) return 'midgame';
    return 'endgame';
  }

  /**
   * Get action space statistics
   */
  getActionSpaceStats(gameState: GameStateType): {
    totalMoves: number;
    winningMoves: number;
    blockingMoves: number;
    forkingMoves: number;
    neutralMoves: number;
  } {
    const analysis = this.moveAnalyzer.analyzeMoves(gameState);

    return {
      totalMoves: analysis.length,
      winningMoves: analysis.filter((move) => move.winInTurns !== null).length,
      blockingMoves: analysis.filter((move) => move.blocksOpponentWin).length,
      forkingMoves: analysis.filter((move) => move.createsFork).length,
      neutralMoves: analysis.filter(
        (move) =>
          move.winInTurns === null &&
          !move.blocksOpponentWin &&
          !move.createsFork
      ).length,
    };
  }
}
```

#### 2.8.3. Enhanced GameState Integration

```typescript
// Enhanced GameState class with action space methods
export class GameState {
  // ... existing code ...
  private actionSpaceAnalyzer: ActionSpaceAnalyzer;

  constructor() {
    // ... existing initialization ...
    this.actionSpaceAnalyzer = new ActionSpaceAnalyzer();
  }

  /**
   * Get complete action space information
   */
  getActionSpace(): ActionSpace {
    return this.actionSpaceAnalyzer.getActionSpace(this.state);
  }

  /**
   * Get action space with grid coordinates
   */
  getActionSpaceWithGrid(): Array<
    Position & { gridPosition: { letter: string; number: number } }
  > {
    return this.actionSpaceAnalyzer.getActionSpaceWithGrid(this.state);
  }

  /**
   * Get strategic action space
   */
  getStrategicActionSpace(
    criteria: 'winning' | 'blocking' | 'forking' | 'all'
  ): Position[] {
    return this.actionSpaceAnalyzer.getStrategicActionSpace(
      this.state,
      criteria
    );
  }

  /**
   * Get action space statistics
   */
  getActionSpaceStats(): {
    totalMoves: number;
    winningMoves: number;
    blockingMoves: number;
    forkingMoves: number;
    neutralMoves: number;
  } {
    return this.actionSpaceAnalyzer.getActionSpaceStats(this.state);
  }
}
```

#### 2.8.4. Usage Examples

```typescript
// Example usage of action space analysis
const gameState = new GameState();

// Get basic action space
const availableMoves = gameState.getAvailableMoves();
console.log('Available moves:', availableMoves);
// Output: [{row: 0, col: 0}, {row: 0, col: 1}, ...]

// Get action space with grid coordinates
const movesWithGrid = gameState.getActionSpaceWithGrid();
console.log('Moves with grid:', movesWithGrid);
// Output: [{row: 0, col: 0, gridPosition: {letter: 'A', number: 1}}, ...]

// Get strategic action space
const winningMoves = gameState.getStrategicActionSpace('winning');
const blockingMoves = gameState.getStrategicActionSpace('blocking');

// Get complete action space analysis
const actionSpace = gameState.getActionSpace();
console.log('Action space:', {
  totalMoves: actionSpace.totalMoves,
  bestMove: actionSpace.bestMove,
  gamePhase: actionSpace.gamePhase,
});

// Get action space statistics
const stats = gameState.getActionSpaceStats();
console.log('Action space stats:', stats);
// Output: {totalMoves: 5, winningMoves: 1, blockingMoves: 2, forkingMoves: 0, neutralMoves: 2}
```

### 2.9. Main Library Export

#### 2.9.1. Main Index File

```typescript
// packages/lib/src/index.ts
// Core game classes
export { GameBoard } from './game/game-board.js';
export { GameState } from './game/game-state.js';
export { GameEngine } from './game/game-engine.js';
export { MoveAnalyzer } from './game/move-analyzer.js';

// Player classes
export { Player } from './players/player.js';
export { HumanPlayer } from './players/human-player.js';
export { RandomAIPlayer } from './players/random-ai-player.js';
export { StrategicAIPlayer } from './players/strategic-ai-player.js';

// Types
export type {
  Player,
  CellValue,
  GameStatus,
  Position,
  GridPosition,
  GameMove,
  GameState,
  MoveAnalysis,
} from './types/game.js';

// Utilities
export { CoordinateSystem } from './utils/coordinate-system.js';
```

### 2.9. Coordinate System Utilities

#### 2.9.1. CoordinateSystem Class

```typescript
// packages/lib/src/utils/coordinate-system.ts
import { Position, GridPosition } from '../types/game.js';

export class CoordinateSystem {
  private static readonly LETTERS = ['A', 'B', 'C'];
  private static readonly NUMBERS = [1, 2, 3];

  /**
   * Convert position to grid coordinates
   */
  static positionToGrid(position: Position): GridPosition {
    return {
      letter: this.LETTERS[position.col],
      number: position.row + 1,
    };
  }

  /**
   * Convert grid coordinates to position
   */
  static gridToPosition(grid: GridPosition): Position {
    return {
      row: grid.number - 1,
      col: this.LETTERS.indexOf(grid.letter),
    };
  }

  /**
   * Validate grid coordinates
   */
  static isValidGridPosition(grid: GridPosition): boolean {
    return (
      this.LETTERS.includes(grid.letter) && this.NUMBERS.includes(grid.number)
    );
  }

  /**
   * Parse grid coordinate string (e.g., "A1", "B2")
   */
  static parseGridString(gridString: string): GridPosition | null {
    const match = gridString.toUpperCase().match(/^([ABC])([123])$/);
    if (!match) {
      return null;
    }
    return {
      letter: match[1],
      number: parseInt(match[2]),
    };
  }

  /**
   * Format position as grid string
   */
  static formatPosition(position: Position): string {
    const grid = this.positionToGrid(position);
    return `${grid.letter}${grid.number}`;
  }

  /**
   * Get all valid grid positions
   */
  static getAllGridPositions(): GridPosition[] {
    const positions: GridPosition[] = [];
    for (const letter of this.LETTERS) {
      for (const number of this.NUMBERS) {
        positions.push({ letter, number });
      }
    }
    return positions;
  }
}
```

## 3. Testing Strategy

### 3.1. Testing Framework

The library will use **Vitest** as the primary testing framework with comprehensive coverage requirements:

- **Unit Tests**: Individual component testing with 100% coverage using Vitest
- **Integration Tests**: Component interaction testing using Vitest
- **Type Testing**: TypeScript type validation with Vitest
- **Performance Tests**: Algorithm efficiency validation using Vitest
- **Edge Case Tests**: Boundary condition testing using Vitest

### 3.2. Test Structure

Each component will have dedicated test files with comprehensive coverage requirements using Vitest:

- **Test Files**: All test files will be in `packages/lib/test/` directory
- **Test Naming**: Test files will follow the pattern `*.test.ts` or `*.spec.ts`
- **Vitest Configuration**: Tests will use the Vitest configuration from the project root
- **Coverage**: All tests will use Vitest's built-in coverage reporting

### 3.3. Integration Tests

Integration tests will verify component interactions and full game scenarios using Vitest:

- **Component Integration**: Tests for how components work together
- **Full Game Scenarios**: Complete game flow testing
- **AI vs AI Games**: Automated game testing between AI players
- **Performance Integration**: End-to-end performance validation

### 3.4. Performance Tests

Performance tests will validate algorithm efficiency and response times using Vitest:

- **Algorithm Efficiency**: Test computational complexity of game algorithms
- **Response Time Validation**: Ensure move analysis completes within acceptable timeframes
- **Memory Usage**: Validate memory efficiency of game state management
- **Scalability**: Test performance with various game scenarios

### 3.5. Test Coverage Requirements

- **Unit Tests**: 100% coverage for all public methods using Vitest
- **Integration Tests**: All component interactions tested using Vitest
- **Edge Cases**: Boundary conditions and error scenarios using Vitest
- **Performance**: Algorithm efficiency validation using Vitest
- **Type Safety**: TypeScript compilation and type checking with Vitest

## 4. Implementation Checklist

### 4.1. Definition of Done

A component is considered complete when:

- [ ] All public methods have comprehensive unit tests
- [ ] TypeScript compilation passes without errors
- [ ] All edge cases are handled properly
- [ ] Performance meets requirements
- [ ] Documentation is complete and accurate
- [ ] Integration with other components works correctly
- [ ] Error handling is user-friendly and comprehensive

### 4.2. Core Components Implementation

#### 4.2.1. Type Definitions

**Goal:** Implement comprehensive TypeScript type definitions.

**Files to Create:**

- `packages/lib/src/types/game.ts` - Core game types

**Test Files to Create:**

- `packages/lib/test/types/game.test.ts` - Type validation tests

**Implementation Tasks:**

- [x] **Implementation:** Define Player, CellValue, GameStatus types
- [x] **Implementation:** Define Position, GridPosition interfaces
- [x] **Implementation:** Define GameMove, GameState interfaces
- [x] **Implementation:** Define MoveAnalysis interface
- [x] **Test:** Create type validation tests using Vitest
- [x] **Test:** Verify TypeScript compilation

#### 4.2.2. Game Board Implementation

**Goal:** Implement the core game board with coordinate system.

**Files to Create:**

- `packages/lib/src/game/game-board.ts` - Game board implementation

**Test Files to Create:**

- `packages/lib/test/game/game-board.test.ts` - Game board tests

**Implementation Tasks:**

- [x] **Implementation:** Create GameBoard class with 3x3 grid
- [x] **Implementation:** Add getCell/setCell methods
- [x] **Implementation:** Add isEmpty/getEmptyPositions methods
- [x] **Implementation:** Add coordinate conversion methods
- [x] **Implementation:** Add board validation methods
- [x] **Test:** Create comprehensive board tests using Vitest
- [x] **Test:** Verify coordinate conversion accuracy

#### 4.2.3. Game State Management

**Goal:** Implement game state management with turn history.

**Files to Create:**

- `packages/lib/src/game/game-state.ts` - Game state implementation

**Test Files to Create:**

- `packages/lib/test/game/game-state.test.ts` - Game state tests

**Implementation Tasks:**

- [x] **Implementation:** Create GameState class
- [x] **Implementation:** Add makeMove method with validation
- [x] **Implementation:** Add win/draw detection
- [x] **Implementation:** Add turn history tracking
- [x] **Implementation:** Add game reset functionality
- [x] **Test:** Create comprehensive state tests using Vitest
- [x] **Test:** Verify win/draw detection accuracy

#### 4.2.4. Move Analysis Engine

**Goal:** Implement move analysis with strategic evaluation.

**Files to Create:**

- `packages/lib/src/game/move-analyzer.ts` - Move analysis implementation

**Test Files to Create:**

- `packages/lib/test/game/move-analyzer.test.ts` - Move analysis tests

**Implementation Tasks:**

- [x] **Implementation:** Create MoveAnalyzer class
- [x] **Implementation:** Add checkWinner method
- [x] **Implementation:** Add analyzeMoves method
- [x] **Implementation:** Add win potential calculation
- [x] **Implementation:** Add blocking move detection
- [x] **Test:** Create comprehensive analysis tests using Vitest
- [x] **Test:** Verify strategic move identification

#### 4.2.5. Player System

**Goal:** Implement flexible player system with AI players.

**Files to Create:**

- `packages/lib/src/players/player.ts` - Abstract player interface
- `packages/lib/src/players/human-player.ts` - Human player implementation
- `packages/lib/src/players/random-ai-player.ts` - Random AI player
- `packages/lib/src/players/strategic-ai-player.ts` - Strategic AI player

**Test Files to Create:**

- `packages/lib/test/players/player.test.ts` - Abstract player tests
- `packages/lib/test/players/human-player.test.ts` - Human player tests
- `packages/lib/test/players/random-ai-player.test.ts` - Random AI player tests
- `packages/lib/test/players/strategic-ai-player.test.ts` - Strategic AI player tests

**Implementation Tasks:**

- [x] **Implementation:** Create abstract Player class
- [x] **Implementation:** Add HumanPlayer with UI integration points
- [x] **Implementation:** Add RandomAIPlayer with random move selection
- [x] **Implementation:** Add StrategicAIPlayer with move analysis
- [x] **Test:** Create comprehensive player tests using Vitest
- [x] **Test:** Verify AI decision making

#### 4.2.6. Game Engine

**Goal:** Implement main game controller and coordination.

**Files to Create:**

- `packages/lib/src/game/game-engine.ts` - Game engine implementation

**Test Files to Create:**

- `packages/lib/test/game/game-engine.test.ts` - Game engine tests

**Implementation Tasks:**

- [ ] **Implementation:** Create GameEngine class
- [ ] **Implementation:** Add player coordination
- [ ] **Implementation:** Add game flow management
- [ ] **Implementation:** Add factory methods for common game types
- [ ] **Implementation:** Add game history tracking
- [ ] **Test:** Create comprehensive engine tests using Vitest
- [ ] **Test:** Verify full game scenarios

#### 4.2.7. Action Space Analysis

**Goal:** Implement comprehensive action space analysis.

**Files to Create:**

- `packages/lib/src/game/action-space.ts` - Action space analysis

**Test Files to Create:**

- `packages/lib/test/game/action-space.test.ts` - Action space tests

**Implementation Tasks:**

- [ ] **Implementation:** Create ActionSpaceAnalyzer class
- [ ] **Implementation:** Add getActionSpace method
- [ ] **Implementation:** Add strategic filtering methods
- [ ] **Implementation:** Add game phase detection
- [ ] **Implementation:** Add action space statistics
- [ ] **Test:** Create comprehensive action space tests using Vitest
- [ ] **Test:** Verify strategic analysis accuracy

#### 4.2.8. Coordinate System Utilities

**Goal:** Implement grid coordinate system utilities.

**Files to Create:**

- `packages/lib/src/utils/coordinate-system.ts` - Coordinate utilities

**Test Files to Create:**

- `packages/lib/test/utils/coordinate-system.test.ts` - Coordinate system tests

**Implementation Tasks:**

- [ ] **Implementation:** Create CoordinateSystem class
- [ ] **Implementation:** Add positionToGrid method
- [ ] **Implementation:** Add gridToPosition method
- [ ] **Implementation:** Add grid string parsing
- [ ] **Implementation:** Add validation methods
- [ ] **Test:** Create comprehensive coordinate tests using Vitest
- [ ] **Test:** Verify coordinate conversion accuracy

#### 4.2.9. Main Library Export

**Goal:** Implement main library export with all components.

**Files to Create:**

- `packages/lib/src/index.ts` - Main library export

**Test Files to Create:**

- `packages/lib/test/index.test.ts` - Export validation tests

**Implementation Tasks:**

- [ ] **Implementation:** Export all core classes
- [ ] **Implementation:** Export all type definitions
- [ ] **Implementation:** Export utility functions
- [ ] **Test:** Verify all exports work correctly using Vitest
- [ ] **Test:** Verify TypeScript compilation

### 4.3 Testing Implementation

**Goal:** Implement comprehensive integration tests.

**Files to Create:**

- `packages/lib/test/integration/` - Integration test directory

**Test Files to Create:**

- `packages/lib/test/integration/ai-vs-ai.test.ts` - AI vs AI game tests
- `packages/lib/test/integration/full-game-scenarios.test.ts` - Full game scenario tests
- `packages/lib/test/integration/performance.test.ts` - Performance tests

**Implementation Tasks:**

- [ ] **Implementation:** Create AI vs AI game tests using Vitest
- [ ] **Implementation:** Create full game scenario tests using Vitest
- [ ] **Implementation:** Create performance tests using Vitest
- [ ] **Test:** Verify integration scenarios work
- [ ] **Test:** Verify performance requirements met
