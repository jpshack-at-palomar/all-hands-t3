# Tic-Tac-Toe CLI Design

## 1. Introduction

### 1.1. Problem Statement

We need to build a command-line interface (CLI) for playing tic-tac-toe that provides a simple, text-based way to play the game. The CLI should integrate with the existing tic-tac-toe game model library and provide an intuitive interface for human players to play against AI opponents. The CLI should support both single games and multi-game matches with proper game state management and clear output formatting.

### 1.2. Proposed Solution

This document outlines the design for a comprehensive tic-tac-toe CLI that provides:

- **Simple Command Interface**: Easy-to-use CLI with clear commands
- **Game Integration**: Full integration with the tic-tac-toe game model library
- **Interactive Gameplay**: Prompt-based move input with grid coordinate system
- **AI Opponents**: Support for different AI player types
- **Match System**: Multi-game match support with alternating first players
- **Clear Output**: Well-formatted game state and move history
- **Comprehensive Testing**: Full test coverage using oclif testing utilities

The CLI will be built using oclif framework with TypeScript, following modern CLI development practices and ensuring high code quality.

### 1.3. Quality Standards

To ensure consistent, high-quality implementations, all code must follow these established standards:

#### 1.3.1. Framework Requirements

All implementations must use the established framework:

- **oclif:** Modern CLI framework with TypeScript support
- **TypeScript:** Strict typing with comprehensive type definitions
- **ES Modules:** Use ES module imports/exports
- **Vitest:** Comprehensive testing framework
- **Clean Architecture:** Separation of concerns and pure functions
- **Error Handling:** Proper error handling with user-friendly messages

#### 1.3.2. Quality Standards

- **User-Friendly Interface:** Clear prompts and helpful error messages
- **Comprehensive Testing:** Unit tests for all commands using oclif testing utilities
- **Type Safety:** Full TypeScript coverage
- **Documentation:** Clear command documentation and usage examples
- **Performance:** Efficient command execution and response times
- **Extensibility:** Easy to add new commands and features

### 1.4. Scope

#### 1.4.1. In Scope for Initial Implementation

- **Core CLI Commands**: New game command with invisible gameplay
- **Game Integration**: Full integration with tic-tac-toe game model library
- **Interactive Prompts**: User-friendly move input with validation
- **AI Integration**: Support for random and strategic AI players
- **Grid Coordinate System**: Letter/number grid system (A1, B2, etc.)
- **Turn History Display**: Simple list of moves made during the game
- **TypeScript Types**: Comprehensive type definitions
- **Unit Tests**: Complete test coverage using oclif testing utilities
- **Documentation**: Command documentation and usage examples

#### 1.4.2. Out of Scope for Initial Implementation

- **Visual Board Display**: No board rendering in M1 or M2
- **Game State Visualization**: No board state display in M1 or M2
- **Network Multiplayer**: No real-time networking
- **Advanced AI**: No minimax or complex game tree algorithms initially
- **Game Variants**: No 4x4 or other board sizes initially
- **Persistence**: No save/load functionality initially
- **Tournament System**: No bracket management or scoring

## 2. Design and Implementation

### 2.1. Overview

The implementation consists of these key components:

1. **CLI Framework**: oclif-based command structure
2. **Game Integration**: Integration with tic-tac-toe game model library
3. **Interactive Prompts**: User-friendly move input system
4. **AI Players**: Random and strategic AI integration
5. **Grid Coordinate System**: Letter/number grid system (A1, B2, C3, etc.)
6. **Turn History Display**: Simple list of moves made during the game
7. **Match System**: Multi-game match support
8. **Type Definitions**: Comprehensive TypeScript types

### 2.1.1. Current Implementation Status

**To Be Implemented:**

- ❌ `NewCommand` - New game command
- ❌ `MatchCommand` - Multi-game match command
- ❌ `GameController` - Game flow management
- ❌ `PromptManager` - Interactive prompt handling
- ❌ `TurnHistoryFormatter` - Turn history display
- ❌ `AIIntegration` - AI player integration
- ❌ `CLITypes` - TypeScript type definitions

### 2.2. Core Data Structures

#### 2.2.1. CLI Types

```typescript
// packages/cli/src/types/cli.ts
export interface GameOptions {
  aiType: 'random' | 'strategic';
  humanFirst: boolean;
}

export interface MatchOptions {
  games: number;
  aiType: 'random' | 'strategic';
}

export interface MoveInput {
  gridPosition: string; // e.g., "A1", "B2"
  position: { row: number; col: number };
}

export interface GameResult {
  winner: 'X' | 'O' | null;
  isDraw: boolean;
  moves: Array<{
    player: 'X' | 'O';
    position: string; // grid position like "A1"
    turn: number;
  }>;
}

export interface MatchResult {
  games: GameResult[];
  humanWins: number;
  aiWins: number;
  draws: number;
  winner: 'human' | 'ai' | 'tie';
}
```

### 2.3. CLI Command Structure

#### 2.3.1. Main Command Structure

```typescript
// packages/cli/src/commands/new.ts
import { Command } from '@oclif/core';
import { GameEngine } from '@t3/lib';
import { PromptManager } from '../utils/prompt-manager.js';
import { OutputFormatter } from '../utils/output-formatter.js';

export default class New extends Command {
  static description = 'Start a new tic-tac-toe game';

  static examples = [
    '$ t3 new',
    '$ t3 new --ai-type strategic',
    '$ t3 new --human-first',
  ];

  static flags = {
    'ai-type': Flags.enum({
      char: 'a',
      description: 'Type of AI opponent',
      options: ['random', 'strategic'],
      default: 'random',
    }),
    'human-first': Flags.boolean({
      char: 'f',
      description: 'Human plays first',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(New);

    const gameController = new GameController();
    const result = await gameController.playGame({
      aiType: flags['ai-type'],
      humanFirst: flags['human-first'],
    });

    this.log(TurnHistoryFormatter.formatGameResult(result));
  }
}
```

#### 2.3.2. Match Command Structure

```typescript
// packages/cli/src/commands/match.ts
import { Command } from '@oclif/core';
import { GameEngine } from '@t3/lib';
import { MatchController } from '../utils/match-controller.js';
import { OutputFormatter } from '../utils/output-formatter.js';

export default class Match extends Command {
  static description = 'Play a multi-game match';

  static examples = [
    '$ t3 match --games 3',
    '$ t3 match --games 5 --ai-type strategic',
  ];

  static flags = {
    games: Flags.integer({
      char: 'g',
      description: 'Number of games in the match',
      default: 3,
      min: 1,
      max: 10,
    }),
    'ai-type': Flags.enum({
      char: 'a',
      description: 'Type of AI opponent',
      options: ['random', 'strategic'],
      default: 'random',
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Match);

    const matchController = new MatchController();
    const result = await matchController.playMatch({
      games: flags.games,
      aiType: flags['ai-type'],
    });

    this.log(TurnHistoryFormatter.formatMatchResult(result));
  }
}
```

### 2.4. Game Controller Implementation

#### 2.4.1. GameController Class

```typescript
// packages/cli/src/utils/game-controller.ts
import { GameEngine, RandomAIPlayer, StrategicAIPlayer } from '@t3/lib';
import { PromptManager } from './prompt-manager.js';
import { TurnHistoryFormatter } from './turn-history-formatter.js';
import { GameOptions, GameResult } from '../types/cli.js';

export class GameController {
  private promptManager: PromptManager;
  private turnHistoryFormatter: TurnHistoryFormatter;

  constructor() {
    this.promptManager = new PromptManager();
    this.turnHistoryFormatter = new TurnHistoryFormatter();
  }

  async playGame(options: GameOptions): Promise<GameResult> {
    // Determine who plays first
    const humanFirst = options.humanFirst ?? this.coinFlip();

    // Create AI player
    const aiPlayer = this.createAIPlayer(options.aiType);

    // Create game engine
    const gameEngine = humanFirst
      ? GameEngine.createHumanVsStrategicAI()
      : GameEngine.createStrategicAIVsHuman();

    this.log(`Starting new game...`);
    this.log(`Human plays ${humanFirst ? 'first' : 'second'}`);
    this.log(`AI type: ${options.aiType}`);
    this.log('');

    const moves: Array<{ player: 'X' | 'O'; position: string; turn: number }> =
      [];
    let turnNumber = 1;

    while (!gameEngine.isGameOver()) {
      const state = gameEngine.getGameState();

      if (
        (state.currentPlayer === 'X' && humanFirst) ||
        (state.currentPlayer === 'O' && !humanFirst)
      ) {
        // Human turn
        const move = await this.promptManager.getHumanMove(state);
        gameEngine.makeMoveAt(move.position);
        moves.push({
          player: state.currentPlayer,
          position: move.gridPosition,
          turn: turnNumber,
        });
      } else {
        // AI turn
        await gameEngine.makeMove();
        const lastMove = state.moves[state.moves.length - 1];
        moves.push({
          player: state.currentPlayer,
          position: `${lastMove.gridPosition.letter}${lastMove.gridPosition.number}`,
          turn: turnNumber,
        });
      }

      turnNumber++;
    }

    const finalState = gameEngine.getGameState();
    this.log(this.turnHistoryFormatter.formatGameEnd(finalState));

    return {
      winner: finalState.winner,
      isDraw: finalState.status === 'draw',
      moves,
    };
  }

  private coinFlip(): boolean {
    return Math.random() < 0.5;
  }

  private createAIPlayer(type: 'random' | 'strategic') {
    switch (type) {
      case 'random':
        return new RandomAIPlayer('O', 'Random AI');
      case 'strategic':
        return new StrategicAIPlayer('O', 'Strategic AI');
      default:
        throw new Error(`Unknown AI type: ${type}`);
    }
  }
}
```

### 2.5. Prompt Management

#### 2.5.1. PromptManager Class

```typescript
// packages/cli/src/utils/prompt-manager.ts
import inquirer from 'inquirer';
import { GameState } from '@t3/lib';
import { MoveInput } from '../types/cli.js';
import { CoordinateSystem } from '@t3/lib';

export class PromptManager {
  async getHumanMove(gameState: GameState): Promise<MoveInput> {
    const availableMoves = gameState.getAvailableMoves();
    const gridMoves = availableMoves.map(move => ({
      ...move,
      gridPosition: CoordinateSystem.positionToGrid(move),
    }));

    const { move } = await inquirer.prompt([
      {
        type: 'list',
        name: 'move',
        message: 'Select your move:',
        choices: gridMoves.map(move => ({
          name: `${move.gridPosition.letter}${move.gridPosition.number}`,
          value: move,
        })),
      },
    ]);

    return {
      gridPosition: `${move.gridPosition.letter}${move.gridPosition.number}`,
      position: { row: move.row, col: move.col },
    };
  }

  async confirmContinue(): Promise<boolean> {
    const { continue } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'continue',
        message: 'Continue?',
        default: true,
      },
    ]);

    return continue;
  }
}
```

### 2.6. Turn History Formatting

#### 2.6.1. TurnHistoryFormatter Class

```typescript
// packages/cli/src/utils/turn-history-formatter.ts
import { GameState, GameStatus } from '@t3/lib';
import { GameResult, MatchResult } from '../types/cli.js';

export class TurnHistoryFormatter {
  formatGameEnd(state: GameState): string {
    if (state.status === 'won') {
      return `\n🎉 ${state.winner} wins! 🎉\n`;
    } else if (state.status === 'draw') {
      return `\n🤝 It's a draw! 🤝\n`;
    }
    return '';
  }

  formatGameResult(result: GameResult): string {
    let output = '\n=== Game Result ===\n';
    output += `Winner: ${result.winner || 'Draw'}\n`;
    output += `Moves: ${result.moves.map((m) => `${m.player}:${m.position}`).join(', ')}\n`;
    return output;
  }

  formatMatchResult(result: MatchResult): string {
    let output = '\n=== Match Result ===\n';
    output += `Games played: ${result.games.length}\n`;
    output += `Human wins: ${result.humanWins}\n`;
    output += `AI wins: ${result.aiWins}\n`;
    output += `Draws: ${result.draws}\n`;
    output += `Match winner: ${result.winner}\n`;
    return output;
  }
}
```

### 2.7. Match Controller

#### 2.7.1. MatchController Class

```typescript
// packages/cli/src/utils/match-controller.ts
import { GameController } from './game-controller.js';
import { MatchOptions, MatchResult, GameResult } from '../types/cli.js';

export class MatchController {
  private gameController: GameController;

  constructor() {
    this.gameController = new GameController();
  }

  async playMatch(options: MatchOptions): Promise<MatchResult> {
    const games: GameResult[] = [];
    let humanWins = 0;
    let aiWins = 0;
    let draws = 0;

    this.log(`Starting ${options.games}-game match...`);
    this.log(`AI type: ${options.aiType}`);
    this.log('');

    for (let game = 1; game <= options.games; game++) {
      this.log(`=== Game ${game} ===`);

      // Alternate who plays first
      const humanFirst = game % 2 === 1;

      const result = await this.gameController.playGame({
        aiType: options.aiType,
        humanFirst,
      });

      games.push(result);

      if (
        (result.winner === 'X' && humanFirst) ||
        (result.winner === 'O' && !humanFirst)
      ) {
        humanWins++;
      } else if (
        (result.winner === 'X' && !humanFirst) ||
        (result.winner === 'O' && humanFirst)
      ) {
        aiWins++;
      } else {
        draws++;
      }

      this.log(`Game ${game} result: ${result.winner || 'Draw'}`);
      this.log('');
    }

    const winner = this.determineMatchWinner(humanWins, aiWins);

    return {
      games,
      humanWins,
      aiWins,
      draws,
      winner,
    };
  }

  private determineMatchWinner(
    humanWins: number,
    aiWins: number
  ): 'human' | 'ai' | 'tie' {
    if (humanWins > aiWins) return 'human';
    if (aiWins > humanWins) return 'ai';
    return 'tie';
  }
}
```

### 2.8. Testing Implementation

#### 2.8.1. Test Utilities Integration

```typescript
// packages/cli/test/utils/test-utils.ts
import { runCommand, captureOutput } from './oclif-test-utils.js';

export class CLITestUtils {
  static async runNewCommand(args: string[] = []): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    return runCommand(['new', ...args]);
  }

  static async runMatchCommand(args: string[] = []): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    return runCommand(['match', ...args]);
  }

  static async simulateGame(moves: string[]): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    // Simulate a complete game with predefined moves
    return captureOutput(async () => {
      // Implementation for simulating game with moves
    });
  }
}
```

#### 2.8.2. Command Tests

```typescript
// packages/cli/test/commands/new.test.ts
import { describe, it, expect } from 'vitest';
import { CLITestUtils } from '../utils/test-utils.js';

describe('New Command', () => {
  it('should start a new game with default options', async () => {
    const result = await CLITestUtils.runNewCommand();

    expect(result.error).toBeUndefined();
    expect(result.stdout).toContain('Starting new game...');
    expect(result.stdout).toContain('AI type: random');
  });

  it('should start a game with strategic AI', async () => {
    const result = await CLITestUtils.runNewCommand(['--ai-type', 'strategic']);

    expect(result.error).toBeUndefined();
    expect(result.stdout).toContain('AI type: strategic');
  });

  it('should start a game with human first', async () => {
    const result = await CLITestUtils.runNewCommand(['--human-first']);

    expect(result.error).toBeUndefined();
    expect(result.stdout).toContain('Human plays first');
  });
});
```

#### 2.8.3. Integration Tests

```typescript
// packages/cli/test/integration/game-flow.test.ts
import { describe, it, expect } from 'vitest';
import { CLITestUtils } from '../utils/test-utils.js';

describe('Game Flow Integration', () => {
  it('should complete a full game with human vs AI', async () => {
    const result = await CLITestUtils.simulateGame(['A1', 'B2', 'C3']);

    expect(result.error).toBeUndefined();
    expect(result.stdout).toContain('Turn');
    expect(result.stdout).toMatch(/X wins|O wins|Draw/);
  });

  it('should handle invalid moves gracefully', async () => {
    const result = await CLITestUtils.simulateGame(['A1', 'A1']); // Invalid duplicate move

    expect(result.stderr).toContain('Invalid move');
  });
});
```

## 3. Testing Strategy

### 3.1. Testing Framework

The CLI will use **oclif testing utilities** with **Vitest** for comprehensive testing:

- **Unit Tests**: Individual command testing with oclif utilities
- **Integration Tests**: Full command flow testing using oclif utilities
- **Type Testing**: TypeScript type validation with Vitest
- **Performance Tests**: Command execution time validation
- **Edge Case Tests**: Error handling and boundary conditions

### 3.2. Test Structure

Each component will have dedicated test files with comprehensive coverage:

- **Test Files**: All test files in `packages/cli/test/` directory
- **Test Naming**: Test files follow pattern `*.test.ts`
- **oclif Testing**: Use provided oclif testing utilities
- **Coverage**: All commands tested with oclif utilities

### 3.3. Integration Tests

Integration tests will verify complete command flows:

- **Command Integration**: Tests for how commands work together
- **Full Game Scenarios**: Complete game flow testing
- **AI vs Human Games**: Automated game testing
- **Performance Integration**: End-to-end performance validation

### 3.4. Performance Tests

Performance tests will validate command execution efficiency:

- **Command Response Time**: Ensure commands complete within acceptable timeframes
- **Memory Usage**: Validate memory efficiency of command execution
- **Scalability**: Test performance with various game scenarios

### 3.5. Test Coverage Requirements

- **Unit Tests**: 100% coverage for all commands using oclif utilities
- **Integration Tests**: All command interactions tested
- **Edge Cases**: Boundary conditions and error scenarios
- **Performance**: Command execution time validation
- **Type Safety**: TypeScript compilation and type checking

## 4. Implementation Checklist

### 4.1. Definition of Done

A component is considered complete when:

- [ ] All commands have comprehensive unit tests using oclif utilities
- [ ] TypeScript compilation passes without errors
- [ ] All edge cases are handled properly
- [ ] Performance meets requirements
- [ ] Documentation is complete and accurate
- [ ] Integration with game model library works correctly
- [ ] Error handling is user-friendly and comprehensive

### 4.2. Milestone 0: Infrastructure

**Goal:** Establish foundational infrastructure for CLI development.

**Components:**

- [ ] CLI type definitions
- [ ] Test utilities integration
- [ ] Development environment setup

**Deliverables:**

- [ ] Comprehensive TypeScript type definitions
- [ ] Integrated oclif testing utilities
- [ ] CLI-specific test utilities
- [ ] Full test coverage for infrastructure

#### 4.2.1. CLI Type Definitions

**Goal:** Implement comprehensive TypeScript type definitions.

**Files to Create:**

- `packages/cli/src/types/cli.ts` - CLI-specific types

**Test Files to Create:**

- `packages/cli/test/types/cli.test.ts` - Type validation tests

**Implementation Tasks:**

- [ ] **Implementation:** Define GameOptions, MatchOptions types
- [ ] **Implementation:** Define MoveInput, GameResult interfaces
- [ ] **Implementation:** Define MatchResult interface
- [ ] **Test:** Create type validation tests using Vitest
- [ ] **Test:** Verify TypeScript compilation

#### 4.2.2. Test Utilities Integration

**Goal:** Integrate oclif testing utilities for comprehensive testing.

**Files to Create:**

- `packages/cli/test/utils/test-utils.ts` - Test utilities
- `packages/cli/test/utils/oclif-test-utils.ts` - oclif testing utilities

**Test Files to Create:**

- `packages/cli/test/utils/test-utils.test.ts` - Test utilities validation

**Implementation Tasks:**

- [ ] **Implementation:** Integrate provided oclif testing utilities
- [ ] **Implementation:** Create CLI-specific test utilities
- [ ] **Implementation:** Add command simulation helpers
- [ ] **Implementation:** Add game flow simulation
- [ ] **Test:** Verify test utilities work correctly
- [ ] **Test:** Verify command simulation accuracy

### 4.3. Milestone 1: Basic CLI

**Goal:** Implement basic CLI with invisible board gameplay.

**Components:**

- [ ] Game controller integration
- [ ] Basic prompt management
- [ ] Turn history display
- [ ] New command implementation
- [ ] AI player integration
- [ ] Comprehensive testing

**Deliverables:**

- [ ] Working `t3 new` command
- [ ] Invisible board gameplay
- [ ] AI opponent support
- [ ] Turn list output
- [ ] Full test coverage

#### 4.3.1. Game Controller Implementation

**Goal:** Implement game flow management and AI integration.

**Files to Create:**

- `packages/cli/src/utils/game-controller.ts` - Game controller

**Test Files to Create:**

- `packages/cli/test/utils/game-controller.test.ts` - Game controller tests

**Implementation Tasks:**

- [ ] **Implementation:** Create GameController class
- [ ] **Implementation:** Add game flow management
- [ ] **Implementation:** Integrate with tic-tac-toe game model
- [ ] **Implementation:** Add AI player creation
- [ ] **Test:** Create comprehensive controller tests using Vitest
- [ ] **Test:** Verify game flow and AI integration

#### 4.3.2. Prompt Manager Implementation

**Goal:** Implement interactive prompt handling for user input.

**Files to Create:**

- `packages/cli/src/utils/prompt-manager.ts` - Prompt management

**Test Files to Create:**

- `packages/cli/test/utils/prompt-manager.test.ts` - Prompt manager tests

**Implementation Tasks:**

- [ ] **Implementation:** Create PromptManager class
- [ ] **Implementation:** Add move input prompts
- [ ] **Implementation:** Add input validation
- [ ] **Implementation:** Add confirmation prompts
- [ ] **Test:** Create comprehensive prompt tests using Vitest
- [ ] **Test:** Verify input validation and user interaction

#### 4.3.3. Turn History Formatter Implementation

**Goal:** Implement simple turn history display.

**Files to Create:**

- `packages/cli/src/utils/turn-history-formatter.ts` - Turn history formatting

**Test Files to Create:**

- `packages/cli/test/utils/turn-history-formatter.test.ts` - Turn history formatter tests

**Implementation Tasks:**

- [ ] **Implementation:** Create TurnHistoryFormatter class
- [ ] **Implementation:** Add game result formatting
- [ ] **Implementation:** Add match result formatting
- [ ] **Implementation:** Add game end announcement
- [ ] **Test:** Create comprehensive formatter tests using Vitest
- [ ] **Test:** Verify turn history formatting accuracy

#### 4.3.4. New Command Implementation

**Goal:** Implement the new game command with interactive gameplay.

**Files to Create:**

- `packages/cli/src/commands/new.ts` - New game command

**Test Files to Create:**

- `packages/cli/test/commands/new.test.ts` - New command tests

**Implementation Tasks:**

- [ ] **Implementation:** Create New command class
- [ ] **Implementation:** Add command flags and options
- [ ] **Implementation:** Integrate with GameController
- [ ] **Implementation:** Add proper error handling
- [ ] **Test:** Create comprehensive command tests using oclif utilities
- [ ] **Test:** Verify command execution and output

#### 4.3.5. Basic CLI Integration Tests

**Goal:** Implement comprehensive integration tests for basic CLI functionality.

**Files to Create:**

- `packages/cli/test/integration/` - Integration test directory

**Test Files to Create:**

- `packages/cli/test/integration/game-flow.test.ts` - Game flow tests
- `packages/cli/test/integration/performance.test.ts` - Performance tests

**Implementation Tasks:**

- [ ] **Implementation:** Create game flow integration tests using oclif utilities
- [ ] **Implementation:** Create performance tests using oclif utilities
- [ ] **Test:** Verify integration scenarios work
- [ ] **Test:** Verify performance requirements met

### 4.4. Milestone 2: Match System

**Goal:** Implement multi-game match system with invisible board.

**Components:**

- [ ] Match controller
- [ ] Alternating first player logic
- [ ] Match result calculation
- [ ] Match command implementation
- [ ] Turn history display
- [ ] Comprehensive testing

**Deliverables:**

- [ ] Working `t3 match` command
- [ ] Multi-game match support
- [ ] Match result tracking
- [ ] Turn list output
- [ ] Full test coverage

#### 4.4.1. Match Controller Implementation

**Goal:** Implement multi-game match management.

**Files to Create:**

- `packages/cli/src/utils/match-controller.ts` - Match controller

**Test Files to Create:**

- `packages/cli/test/utils/match-controller.test.ts` - Match controller tests

**Implementation Tasks:**

- [ ] **Implementation:** Create MatchController class
- [ ] **Implementation:** Add match flow management
- [ ] **Implementation:** Add alternating first player logic
- [ ] **Implementation:** Add match result calculation
- [ ] **Test:** Create comprehensive match tests using Vitest
- [ ] **Test:** Verify match flow and result calculation

#### 4.4.2. Match Command Implementation

**Goal:** Implement the match command for multi-game matches.

**Files to Create:**

- `packages/cli/src/commands/match.ts` - Match command

**Test Files to Create:**

- `packages/cli/test/commands/match.test.ts` - Match command tests

**Implementation Tasks:**

- [ ] **Implementation:** Create Match command class
- [ ] **Implementation:** Add match-specific flags and options
- [ ] **Implementation:** Integrate with MatchController
- [ ] **Implementation:** Add match result formatting
- [ ] **Test:** Create comprehensive match tests using oclif utilities
- [ ] **Test:** Verify multi-game match execution

#### 4.4.3. Match System Integration Tests

**Goal:** Implement comprehensive integration tests for match system functionality.

**Test Files to Create:**

- `packages/cli/test/integration/match-flow.test.ts` - Match flow tests

**Implementation Tasks:**

- [ ] **Implementation:** Create match flow integration tests using oclif utilities
- [ ] **Test:** Verify match scenarios work correctly
- [ ] **Test:** Verify match result calculation accuracy

### 4.5. Milestone 3: Visual Display

**Goal:** Add visual board display and game state visualization.

**Components:**

- [ ] Board rendering implementation
- [ ] Enhanced output formatting
- [ ] Game state visualization
- [ ] Visual match display
- [ ] Comprehensive testing

**Deliverables:**

- [ ] Visual board display
- [ ] Game state visualization
- [ ] Enhanced user experience
- [ ] Visual match tracking
- [ ] Full test coverage

#### 4.5.1. Board Rendering Implementation

**Goal:** Implement visual board display functionality.

**Files to Create:**

- `packages/cli/src/utils/board-renderer.ts` - Board rendering

**Test Files to Create:**

- `packages/cli/test/utils/board-renderer.test.ts` - Board renderer tests

**Implementation Tasks:**

- [ ] **Implementation:** Create BoardRenderer class
- [ ] **Implementation:** Add ASCII board display
- [ ] **Implementation:** Add game state visualization
- [ ] **Implementation:** Add move highlighting
- [ ] **Test:** Create comprehensive renderer tests using Vitest
- [ ] **Test:** Verify board display accuracy

#### 4.5.2. Enhanced Output Formatting

**Goal:** Implement enhanced output formatting for better user experience.

**Files to Create:**

- `packages/cli/src/utils/output-formatter.ts` - Output formatting

**Test Files to Create:**

- `packages/cli/test/utils/output-formatter.test.ts` - Output formatter tests

**Implementation Tasks:**

- [ ] **Implementation:** Create OutputFormatter class
- [ ] **Implementation:** Add enhanced game state display
- [ ] **Implementation:** Add visual match tracking
- [ ] **Implementation:** Add progress indicators
- [ ] **Test:** Create comprehensive formatter tests using Vitest
- [ ] **Test:** Verify output formatting accuracy

#### 4.5.3. Visual Display Integration Tests

**Goal:** Implement comprehensive integration tests for visual display functionality.

**Test Files to Create:**

- `packages/cli/test/integration/visual-display.test.ts` - Visual display tests

**Implementation Tasks:**

- [ ] **Implementation:** Create visual display integration tests using oclif utilities
- [ ] **Test:** Verify visual display scenarios work correctly
- [ ] **Test:** Verify enhanced user experience features

## 6. Usage Examples

### 6.1. Basic Game

```bash
# Start a new game with random AI
$ t3 new

# Start a game with strategic AI
$ t3 new --ai-type strategic

# Start a game with human first
$ t3 new --human-first
```

### 6.2. Match Play

```bash
# Play a 3-game match (default)
$ t3 match

# Play a 5-game match with strategic AI
$ t3 match --games 5 --ai-type strategic
```

### 6.3. Expected Output

```plaintext
Starting new game...
Human plays second
AI type: strategic

Select your move:
❯ A1
   B2
   C3
   A2
   B1
   C1
   A3
   B3
   C2

🎉 X wins! 🎉

=== Game Result ===
Winner: X
Moves: X:A1, O:B2, X:C3
```
