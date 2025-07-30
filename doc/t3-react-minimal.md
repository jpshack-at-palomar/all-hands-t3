# Minimal Tic-Tac-Toe React Components (Milestone 1)

## Overview

This document outlines the **minimal set of React components** needed for a functional tic-tac-toe game. The goal is to create a working game with the fewest possible components while maintaining good architecture and accessibility.

## Minimal Component Architecture

### Core Components (4 total)

#### 1. GameProvider (Context Provider)

```typescript
interface GameProviderProps {
  children: React.ReactNode;
  gameType?: 'human-vs-human' | 'human-vs-ai';
}

interface GameContextValue {
  gameState: GameState;
  makeMove: (position: Position) => Promise<boolean>;
  resetGame: () => void;
  isLoading: boolean;
}
```

**Responsibilities:**

- Manages game state and engine
- Handles AI moves automatically
- Provides game actions to child components

#### 2. GameBoard

```typescript
interface GameBoardProps {
  board: CellValue[][];
  onCellClick: (position: Position) => void;
  disabled?: boolean;
  currentPlayer: Player;
  gameStatus: GameStatus;
}
```

**Responsibilities:**

- Renders the 3x3 game grid
- Handles cell click events
- Shows game status and current player
- Manages accessibility

#### 3. GameCell

```typescript
interface GameCellProps {
  value: CellValue;
  position: Position;
  onClick: (position: Position) => void;
  disabled?: boolean;
  isCurrentPlayerTurn: boolean;
}
```

**Responsibilities:**

- Renders individual grid cells
- Handles click and keyboard events
- Shows player symbols (X/O)
- Manages focus and accessibility

#### 4. GameStatus

```typescript
interface GameStatusProps {
  gameState: GameState;
  onReset: () => void;
}
```

**Responsibilities:**

- Shows current game status (playing/won/draw)
- Displays current player turn
- Provides reset button
- Shows winner when game ends

## Minimal Implementation

### Basic Game Structure

```typescript
// App.tsx - Main game component
function App() {
  return (
    <GameProvider>
      <div className="game">
        <GameStatus />
        <GameBoard />
      </div>
    </GameProvider>
  );
}
```

### GameProvider Implementation

```typescript
const GameProvider: React.FC<GameProviderProps> = ({ children, gameType = 'human-vs-human' }) => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const engine = gameType === 'human-vs-human'
      ? GameEngine.createHumanVsHuman()
      : GameEngine.createHumanVsRandomAI();

    setGameEngine(engine);
    setGameState(engine.getGameState());
  }, [gameType]);

  const makeMove = useCallback(async (position: Position) => {
    if (!gameEngine || gameState?.status !== 'playing') return false;

    setIsLoading(true);

    try {
      const success = gameEngine.makeMoveAt(position);
      if (success) {
        setGameState(gameEngine.getGameState());

        // Handle AI move if needed
        if (gameType === 'human-vs-ai' && gameEngine.getGameState().currentPlayer !== 'X') {
          await gameEngine.makeMove();
          setGameState(gameEngine.getGameState());
        }
      }
      return success;
    } finally {
      setIsLoading(false);
    }
  }, [gameEngine, gameState, gameType]);

  const resetGame = useCallback(() => {
    if (gameEngine) {
      gameEngine.reset();
      setGameState(gameEngine.getGameState());
    }
  }, [gameEngine]);

  const value = {
    gameState,
    makeMove,
    resetGame,
    isLoading
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
```

### GameBoard Implementation

```typescript
const GameBoard: React.FC<GameBoardProps> = ({
  board,
  onCellClick,
  disabled,
  currentPlayer,
  gameStatus
}) => {
  return (
    <div
      className="game-board"
      role="grid"
      aria-label={`Tic-tac-toe game, ${gameStatus === 'playing' ? `${currentPlayer}'s turn` : 'game over'}`}
    >
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="game-board__row" role="row">
          {row.map((cell, colIndex) => (
            <GameCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              position={{ row: rowIndex, col: colIndex }}
              onClick={onCellClick}
              disabled={disabled || cell !== null}
              isCurrentPlayerTurn={gameStatus === 'playing'}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
```

### GameCell Implementation

```typescript
const GameCell: React.FC<GameCellProps> = ({
  value,
  position,
  onClick,
  disabled,
  isCurrentPlayerTurn
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && isCurrentPlayerTurn) {
      onClick(position);
    }
  }, [onClick, position, disabled, isCurrentPlayerTurn]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const gridPos = CoordinateSystem.positionToGrid(position);
  const ariaLabel = value
    ? `Cell ${gridPos.letter}${gridPos.number} occupied by ${value}`
    : `Empty cell ${gridPos.letter}${gridPos.number}, click to place ${isCurrentPlayerTurn ? 'your mark' : ''}`;

  return (
    <button
      className={`game-cell ${value ? `game-cell--${value.toLowerCase()}` : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={ariaLabel}
      tabIndex={disabled ? -1 : 0}
    >
      {value && <span className="game-cell__symbol">{value}</span>}
    </button>
  );
};
```

### GameStatus Implementation

```typescript
const GameStatus: React.FC<GameStatusProps> = ({ gameState, onReset }) => {
  const getStatusText = () => {
    if (gameState.status === 'won') {
      return `Game won by ${gameState.winner}!`;
    }
    if (gameState.status === 'draw') {
      return 'Game ended in a draw!';
    }
    return `${gameState.currentPlayer}'s turn`;
  };

  return (
    <div className="game-status">
      <div className="game-status__text">{getStatusText()}</div>
      <button
        className="game-status__reset"
        onClick={onReset}
        aria-label="Reset game"
      >
        New Game
      </button>
    </div>
  );
};
```

## Minimal CSS Structure

```css
.game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.game-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.game-cell {
  width: 4rem;
  height: 4rem;
  border: none;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.game-cell:hover:not(:disabled) {
  background: #f1f5f9;
}

.game-cell--x {
  color: #3b82f6;
}

.game-cell--o {
  color: #ef4444;
}

.game-status {
  text-align: center;
}

.game-status__text {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.game-status__reset {
  padding: 0.5rem 1rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
}

.game-status__reset:hover {
  background: #2563eb;
}
```

## Usage Examples

### Basic Human vs Human

```typescript
function HumanVsHumanGame() {
  return (
    <GameProvider gameType="human-vs-human">
      <div className="game">
        <GameStatus />
        <GameBoard />
      </div>
    </GameProvider>
  );
}
```

### Human vs AI

```typescript
function HumanVsAIGame() {
  return (
    <GameProvider gameType="human-vs-ai">
      <div className="game">
        <GameStatus />
        <GameBoard />
      </div>
    </GameProvider>
  );
}
```

## Key Benefits of This Minimal Approach

### 1. **Simplicity**

- Only 4 components to understand and maintain
- Clear separation of responsibilities
- Easy to test and debug

### 2. **Functionality**

- Complete game functionality
- AI opponent support
- Game state management
- Reset capability

### 3. **Accessibility**

- Full keyboard navigation
- Screen reader support
- ARIA labels and roles
- Focus management

### 4. **Extensibility**

- Easy to add features later
- Clear component boundaries
- Modular design

## Future Milestones

### Milestone 2: Enhanced Features

- Move history component
- Game analysis/hints
- Player information
- Settings panel

### Milestone 3: Advanced Features

- Multiple AI types
- Game statistics
- Custom themes
- Animations

### Milestone 4: Polish

- Advanced animations
- Sound effects
- Multiplayer support
- Advanced analysis

## Testing Strategy

### Component Tests

```typescript
describe('GameBoard', () => {
  it('renders 9 cells', () => {
    render(<GameBoard board={emptyBoard} onCellClick={jest.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(9);
  });

  it('calls onCellClick when cell is clicked', () => {
    const onCellClick = jest.fn();
    render(<GameBoard board={emptyBoard} onCellClick={onCellClick} />);

    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(onCellClick).toHaveBeenCalledWith({ row: 0, col: 0 });
  });
});
```

### Integration Tests

```typescript
describe('Game Integration', () => {
  it('plays a complete game', async () => {
    render(
      <GameProvider gameType="human-vs-human">
        <GameStatus />
        <GameBoard />
      </GameProvider>
    );

    const cells = screen.getAllByRole('button');
    await userEvent.click(cells[0]); // X move
    await userEvent.click(cells[4]); // O move
    await userEvent.click(cells[1]); // X move

    expect(screen.getByText("X's turn")).toBeInTheDocument();
  });
});
```

## Conclusion

This minimal component architecture provides a **complete, functional tic-tac-toe game** with only 4 components. The design prioritizes:

- **Simplicity**: Easy to understand and implement
- **Functionality**: Complete game with AI support
- **Accessibility**: Full keyboard and screen reader support
- **Extensibility**: Clear path for adding features

This approach allows for rapid development and testing while maintaining a solid foundation for future enhancements. The minimal set ensures that milestone 1 can be completed quickly while providing a fully functional game experience.
