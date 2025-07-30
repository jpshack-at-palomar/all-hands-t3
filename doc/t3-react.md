# Tic-Tac-Toe React Component Design

## Overview

This document outlines the React component architecture for the tic-tac-toe game, designed to work with the pure game model library. The components provide a modern, accessible, and extensible UI layer that can be easily integrated into various React applications.

## Design Principles

### 1. Separation of Concerns

- **Game Logic**: Handled by the pure game model library
- **UI State**: Managed by React components
- **User Interaction**: Coordinated through component props and callbacks

### 2. Accessibility First

- Full keyboard navigation support
- Screen reader compatibility
- ARIA labels and roles
- Focus management

### 3. Responsive Design

- Mobile-first approach
- Touch-friendly interactions
- Adaptive layouts

### 4. Type Safety

- Full TypeScript integration
- Props validation
- Event type safety

## Component Architecture

### Core Components

#### 1. GameProvider (Context Provider)

```typescript
interface GameProviderProps {
  children: React.ReactNode;
  initialGameType?: 'human-vs-human' | 'human-vs-ai' | 'ai-vs-ai';
  aiPlayerType?: 'random' | 'strategic';
}

interface GameContextValue {
  gameState: GameState;
  gameEngine: GameEngine;
  makeMove: (position: Position) => Promise<boolean>;
  resetGame: () => void;
  isLoading: boolean;
  error: string | null;
}
```

**Responsibilities:**

- Manages game state and engine
- Provides game actions to child components
- Handles AI player moves
- Manages loading states and errors

#### 2. GameBoard

```typescript
interface GameBoardProps {
  board: CellValue[][];
  onCellClick: (position: Position) => void;
  highlightedCells?: Position[];
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: 'default' | 'dark' | 'minimal';
}
```

**Responsibilities:**

- Renders the 3x3 game grid
- Handles cell click events
- Shows move highlights and animations
- Manages accessibility for grid navigation

#### 3. GameCell

```typescript
interface GameCellProps {
  value: CellValue;
  position: Position;
  onClick: (position: Position) => void;
  highlighted?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: 'default' | 'dark' | 'minimal';
}
```

**Responsibilities:**

- Renders individual grid cells
- Handles click and keyboard events
- Shows player symbols (X/O) with animations
- Manages focus and accessibility

#### 4. GameStatus

```typescript
interface GameStatusProps {
  gameState: GameState;
  showTurnIndicator?: boolean;
  showMoveCount?: boolean;
  size?: 'small' | 'medium' | 'large';
}
```

**Responsibilities:**

- Displays current game status
- Shows current player turn
- Indicates game result (win/draw)
- Shows move count and game phase

#### 5. GameControls

```typescript
interface GameControlsProps {
  onReset: () => void;
  onUndo?: () => void;
  onHint?: () => void;
  canUndo?: boolean;
  canHint?: boolean;
  gameType?: string;
  onGameTypeChange?: (type: string) => void;
}
```

**Responsibilities:**

- Provides game control buttons
- Handles game reset and undo
- Offers hints and analysis
- Manages game type selection

### Feature Components

#### 6. MoveHistory

```typescript
interface MoveHistoryProps {
  moves: GameMove[];
  currentMoveIndex?: number;
  onMoveSelect?: (index: number) => void;
  maxHeight?: string;
  showTimestamps?: boolean;
}
```

**Responsibilities:**

- Displays move history
- Allows move replay/navigation
- Shows move timestamps
- Provides move analysis

#### 7. GameAnalysis

```typescript
interface GameAnalysisProps {
  gameState: GameState;
  moveAnalysis?: MoveAnalysis[];
  showBestMoves?: boolean;
  showStrategicAnalysis?: boolean;
  collapsible?: boolean;
}
```

**Responsibilities:**

- Shows move analysis and hints
- Displays strategic information
- Provides AI insights
- Offers learning opportunities

#### 8. PlayerInfo

```typescript
interface PlayerInfoProps {
  player: Player;
  name?: string;
  type: 'human' | 'ai';
  aiType?: 'random' | 'strategic';
  isCurrentPlayer: boolean;
  score?: number;
  avatar?: string;
}
```

**Responsibilities:**

- Displays player information
- Shows player type and AI details
- Indicates current player
- Manages player avatars and scores

#### 9. GameSettings

```typescript
interface GameSettingsProps {
  gameType: string;
  aiPlayerType: string;
  onGameTypeChange: (type: string) => void;
  onAIPlayerTypeChange: (type: string) => void;
  showAdvancedOptions?: boolean;
}
```

**Responsibilities:**

- Manages game configuration
- Allows AI player selection
- Provides advanced settings
- Handles game type changes

### Layout Components

#### 10. GameLayout

```typescript
interface GameLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  layout?: 'centered' | 'sidebar' | 'fullscreen';
}
```

**Responsibilities:**

- Provides responsive layout structure
- Manages sidebar and main content
- Handles responsive breakpoints
- Provides consistent spacing

#### 11. GameContainer

```typescript
interface GameContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  background?: string;
  border?: string;
}
```

**Responsibilities:**

- Wraps game components
- Provides consistent styling
- Manages container constraints
- Handles responsive behavior

## State Management

### Game State Flow

```typescript
// State management pattern
const useGameState = () => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeMove = useCallback(
    async (position: Position) => {
      if (!gameEngine) return false;

      setIsLoading(true);
      setError(null);

      try {
        const success = gameEngine.makeMoveAt(position);
        if (success) {
          setGameState(gameEngine.getGameState());
          // Handle AI move if needed
          if (gameEngine.getGameState().currentPlayer !== 'X') {
            await gameEngine.makeMove();
            setGameState(gameEngine.getGameState());
          }
        }
        return success;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [gameEngine]
  );

  return {
    gameState,
    makeMove,
    isLoading,
    error,
    resetGame: useCallback(() => {
      if (gameEngine) {
        gameEngine.reset();
        setGameState(gameEngine.getGameState());
      }
    }, [gameEngine]),
  };
};
```

### Component State Patterns

#### Local State for UI Interactions

```typescript
const useGameBoardState = () => {
  const [highlightedCells, setHighlightedCells] = useState<Position[]>([]);
  const [hoveredCell, setHoveredCell] = useState<Position | null>(null);
  const [lastMove, setLastMove] = useState<Position | null>(null);

  return {
    highlightedCells,
    setHighlightedCells,
    hoveredCell,
    setHoveredCell,
    lastMove,
    setLastMove,
  };
};
```

#### Shared State for Game Features

```typescript
const useGameFeatures = () => {
  const [showHints, setShowHints] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(
    null
  );

  return {
    showHints,
    setShowHints,
    showAnalysis,
    setShowAnalysis,
    selectedMoveIndex,
    setSelectedMoveIndex,
  };
};
```

## Event Handling

### Click Events

```typescript
const handleCellClick = useCallback(
  (position: Position) => {
    if (gameState?.status !== 'playing') return;
    if (gameState.currentPlayer !== 'X') return; // Human player only

    makeMove(position);
  },
  [gameState, makeMove]
);
```

### Keyboard Events

```typescript
const handleKeyDown = useCallback(
  (event: KeyboardEvent, position: Position) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleCellClick(position);
        break;
      case 'ArrowUp':
        // Navigate to cell above
        break;
      case 'ArrowDown':
        // Navigate to cell below
        break;
      // ... other navigation keys
    }
  },
  [handleCellClick]
);
```

### Touch Events

```typescript
const handleTouchStart = useCallback((event: TouchEvent) => {
  // Handle touch interactions
  // Prevent double-tap zoom
  event.preventDefault();
}, []);

const handleTouchEnd = useCallback(
  (event: TouchEvent, position: Position) => {
    // Handle touch release
    handleCellClick(position);
  },
  [handleCellClick]
);
```

## Accessibility Features

### ARIA Labels and Roles

```typescript
const getCellAriaLabel = (position: Position, value: CellValue) => {
  const gridPos = CoordinateSystem.positionToGrid(position);
  const cellName = `${gridPos.letter}${gridPos.number}`;

  if (value === null) {
    return `Empty cell ${cellName}, click to place ${currentPlayer}`;
  }

  return `Cell ${cellName} occupied by ${value}`;
};

const getBoardAriaLabel = (gameState: GameState) => {
  if (gameState.status === 'won') {
    return `Game won by ${gameState.winner}`;
  }
  if (gameState.status === 'draw') {
    return 'Game ended in a draw';
  }
  return `Tic-tac-toe game, ${gameState.currentPlayer}'s turn`;
};
```

### Focus Management

```typescript
const useFocusManagement = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLButtonElement | null)[][]>([]);

  const focusCell = useCallback((row: number, col: number) => {
    const cell = cellRefs.current[row]?.[col];
    cell?.focus();
  }, []);

  const focusFirstAvailableCell = useCallback(() => {
    // Focus first empty cell
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameState?.board[row][col] === null) {
          focusCell(row, col);
          return;
        }
      }
    }
  }, [gameState, focusCell]);

  return {
    boardRef,
    cellRefs,
    focusCell,
    focusFirstAvailableCell,
  };
};
```

## Styling and Theming

### CSS Variables for Theming

```css
:root {
  /* Colors */
  --game-primary: #3b82f6;
  --game-secondary: #ef4444;
  --game-background: #ffffff;
  --game-surface: #f8fafc;
  --game-border: #e2e8f0;
  --game-text: #1e293b;
  --game-text-muted: #64748b;

  /* Spacing */
  --game-spacing-xs: 0.25rem;
  --game-spacing-sm: 0.5rem;
  --game-spacing-md: 1rem;
  --game-spacing-lg: 1.5rem;
  --game-spacing-xl: 2rem;

  /* Sizes */
  --game-cell-size: 4rem;
  --game-board-size: 12rem;
  --game-border-radius: 0.5rem;

  /* Animations */
  --game-transition: 0.2s ease-in-out;
  --game-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Theme Variants

```typescript
const themes = {
  default: {
    primary: '#3b82f6',
    secondary: '#ef4444',
    background: '#ffffff',
    surface: '#f8fafc',
  },
  dark: {
    primary: '#60a5fa',
    secondary: '#f87171',
    background: '#1e293b',
    surface: '#334155',
  },
  minimal: {
    primary: '#000000',
    secondary: '#666666',
    background: '#ffffff',
    surface: '#fafafa',
  },
};
```

## Animation and Interactions

### Cell Animations

```typescript
const useCellAnimation = (value: CellValue, isNewMove: boolean) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isNewMove && value) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [value, isNewMove]);

  return {
    isAnimating,
    animationClass: isAnimating ? 'cell-pop' : '',
  };
};
```

### Board Transitions

```typescript
const useBoardTransitions = (gameState: GameState) => {
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 150);
    return () => clearTimeout(timer);
  }, [gameState.turnNumber]);

  return {
    isTransitioning,
    transitionClass: isTransitioning ? 'board-transition' : '',
  };
};
```

## Performance Optimizations

### Memoization

```typescript
const GameCell = memo<GameCellProps>(({
  value,
  position,
  onClick,
  highlighted,
  disabled,
  size = 'medium',
  theme = 'default'
}) => {
  const handleClick = useCallback(() => {
    if (!disabled) {
      onClick(position);
    }
  }, [onClick, position, disabled]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <button
      className={`game-cell game-cell--${size} game-cell--${theme}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-label={getCellAriaLabel(position, value)}
      tabIndex={disabled ? -1 : 0}
    >
      {value && <span className="game-cell__symbol">{value}</span>}
    </button>
  );
});
```

### Virtual Scrolling for History

```typescript
const MoveHistory = ({ moves, onMoveSelect }: MoveHistoryProps) => {
  const itemHeight = 40;
  const containerHeight = 300;
  const visibleItems = Math.ceil(containerHeight / itemHeight);

  return (
    <div className="move-history">
      <VirtualList
        height={containerHeight}
        itemCount={moves.length}
        itemSize={itemHeight}
        overscanCount={5}
      >
        {({ index, style }) => (
          <div style={style} className="move-history__item">
            <button onClick={() => onMoveSelect?.(index)}>
              Move {index + 1}: {moves[index].player} at {formatPosition(moves[index].position)}
            </button>
          </div>
        )}
      </VirtualList>
    </div>
  );
};
```

## Error Handling

### Error Boundaries

```typescript
class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Game error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="game-error">
          <h2>Something went wrong</h2>
          <p>Please refresh the page to try again.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Loading States

```typescript
const useLoadingState = () => {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {}
  );

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: loading }));
  }, []);

  const isLoading = useCallback(
    (key: string) => loadingStates[key] || false,
    [loadingStates]
  );

  return { setLoading, isLoading };
};
```

## Testing Strategy

### Component Testing

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

  it('disables cells when game is over', () => {
    render(<GameBoard board={wonBoard} onCellClick={jest.fn()} disabled />);

    const cells = screen.getAllByRole('button');
    cells.forEach(cell => {
      expect(cell).toBeDisabled();
    });
  });
});
```

### Integration Testing

```typescript
describe('Game Integration', () => {
  it('plays a complete game', async () => {
    render(
      <GameProvider>
        <GameBoard />
        <GameControls />
      </GameProvider>
    );

    // Make moves
    const cells = screen.getAllByRole('button');
    await userEvent.click(cells[0]); // X move
    await userEvent.click(cells[4]); // O move
    await userEvent.click(cells[1]); // X move

    // Check game state
    expect(screen.getByText("X's turn")).toBeInTheDocument();
  });
});
```

## Usage Examples

### Basic Game

```typescript
import { GameProvider, GameBoard, GameControls, GameStatus } from '@pnpm-template/react';

function App() {
  return (
    <GameProvider>
      <div className="game">
        <GameStatus />
        <GameBoard />
        <GameControls />
      </div>
    </GameProvider>
  );
}
```

### Advanced Game with Analysis

```typescript
import {
  GameProvider,
  GameBoard,
  GameControls,
  GameStatus,
  MoveHistory,
  GameAnalysis
} from '@pnpm-template/react';

function AdvancedGame() {
  return (
    <GameProvider initialGameType="human-vs-strategic">
      <div className="game-layout">
        <div className="game-main">
          <GameStatus />
          <GameBoard />
          <GameControls />
        </div>
        <div className="game-sidebar">
          <MoveHistory />
          <GameAnalysis />
        </div>
      </div>
    </GameProvider>
  );
}
```

### Custom Styling

```typescript
import { GameBoard } from '@pnpm-template/react';

function CustomGame() {
  return (
    <GameBoard
      board={gameState.board}
      onCellClick={handleCellClick}
      size="large"
      theme="dark"
      className="custom-game-board"
    />
  );
}
```

## Conclusion

This React component design provides a comprehensive, accessible, and performant UI layer for the tic-tac-toe game. The component architecture follows React best practices while maintaining flexibility for different use cases and styling requirements.

The design emphasizes:

- **Separation of concerns** between game logic and UI
- **Accessibility** as a first-class feature
- **Performance** through proper memoization and optimization
- **Type safety** with full TypeScript integration
- **Testability** with clear component boundaries
- **Extensibility** for custom themes and features

This architecture can be easily extended with additional features such as multiplayer support, advanced AI analysis, or custom game variants while maintaining the core design principles.
