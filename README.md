# Tic-Tac-Toe Game

A playable tic-tac-toe game built as a technical assessment demonstrating
AI-assisted development, engineering process, and problem-solving under time
constraints.

## Project Overview

This is a 3-hour technical assessment to build a playable tic-tac-toe game using
AI tools. The goal is to demonstrate engineering process, tool usage, and
problem-solving under time constraints rather than creating a perfect
application.

### Key Requirements

- Build a playable tic-tac-toe game in any language/framework
- Use at least one AI tool during development
- Record the entire development session
- Submit working code with README and screen recording

### Success Criteria

- Functional, playable game
- Clear demonstration of AI tool usage
- Evidence of critical thinking and problem-solving
- Working codebase with proper documentation

## Strategic Approach

### Risk Management Strategy

The primary challenge is balancing demonstration of engineering skills with time
constraints. Key strategies:

- **Avoid Tar Pits**: Focus on getting to a playable state quickly rather than
  perfect implementation
- **Time Boxing**: 30-minute checkpoints to assess progress and adjust scope
- **Incremental Delivery**: Start with simplest viable implementation, then
  enhance
- **Code Reuse**: Leverage existing game logic from previous projects

### Technical Philosophy

- **Done > Perfect**: Prioritize working functionality over polish
- **Critical AI Usage**: Demonstrate thoughtful use of AI tools, not blind
  acceptance
- **Process Visibility**: Show reasoning, tradeoffs, and decision-making clearly
- **Infrastructure First**: Establish basic project structure and workflows
  early

## Implementation Strategy

### Core Game Engine

Start with a mental tic-tac-toe implementation (no visual board) that accepts
moves in coordinate format (e.g., "A1", "B2"). This approach:

- Eliminates UI complexity initially
- Focuses on core game logic
- Enables rapid iteration and testing
- Provides foundation for multiple frontend implementations

### Development Phases

1. **Library/Engine**: Core game logic and state management
2. **Basic CLI**: Simple command-line interface for gameplay
3. **Enhanced Interfaces**: React app, voice activation, or other advanced
   features
4. **Polish & Documentation**: README, deployment, final touches

## Milestone Plan

### Milestone 1: Foundation (30 minutes)

**Goal**: Establish project infrastructure and core game engine

**Deliverables**:

- GitHub repository with basic structure
- Core game engine with state management
- Basic test framework
- Initial commit and workflow setup

**Success Criteria**:

- Game engine can handle moves and detect win conditions
- Basic project structure is in place
- Ready for rapid iteration

### Milestone 2: Playable Game (60 minutes)

**Goal**: Create a functional, playable tic-tac-toe game

**Deliverables**:

- Command-line interface for gameplay
- Mental tic-tac-toe implementation (coordinate-based moves)
- Random AI opponent
- Basic game flow (start, play, end, restart)

**Success Criteria**:

- Can play a complete game from start to finish
- Handles invalid moves gracefully
- Demonstrates core game logic working

### Milestone 3: Enhanced Interface (60 minutes)

**Goal**: Add a more sophisticated user interface

**Options** (choose based on time remaining):

- **React Web App**: Visual board with click interactions
- **Advanced CLI**: Better formatting, game history, statistics
- **Voice Interface**: Browser-based voice recognition for moves
- **Touch Interface**: Raspberry Pi with touchscreen (if hardware available)

**Success Criteria**:

- Improved user experience over basic CLI
- Demonstrates ability to add features incrementally
- Shows technical versatility

### Milestone 4: Polish & Documentation (30 minutes)

**Goal**: Finalize submission materials

**Deliverables**:

- Comprehensive README with setup instructions
- Code documentation and comments
- Deployment configuration (if applicable)
- Final testing and bug fixes

**Success Criteria**:

- Repository is ready for submission
- Clear instructions for running the application
- Professional presentation of work

## AI Tool Strategy

### Planned Usage

- **Code generation**: Scaffold project structure and basic implementations
- **Design exploration**: Generate multiple interface options in parallel
- **Documentation**: Assist with README and code comments
- **Problem solving**: Help debug issues and optimize solutions

### Critical Evaluation

- **Code review**: Manually inspect all AI-generated code
- **Testing**: Verify functionality before integration
- **Customization**: Adapt AI suggestions to project-specific needs
- **Learning**: Use AI to explore unfamiliar technologies quickly

## Success Metrics

### Functional Requirements

- [ ] Playable tic-tac-toe game
- [ ] AI tool usage demonstrated
- [ ] Screen recording completed
- [ ] Working codebase submitted

### Process Requirements

- [ ] Clear demonstration of problem-solving approach
- [ ] Evidence of critical thinking with AI tools
- [ ] Effective time management under constraints
- [ ] Professional communication of process and decisions

### Technical Excellence

- [ ] Clean, maintainable code structure
- [ ] Proper error handling and edge cases
- [ ] Clear documentation and setup instructions
- [ ] Extensible architecture for future enhancements

---

# pnpm-template

A comprehensive pnpm workspace template with TypeScript, Vitest, ESLint,
Prettier, and GitHub Actions CI/CD.

## Features

- 📦 **pnpm workspace** with monorepo structure
- 🔧 **TypeScript** with strict configuration and modern ES2022 features
- 🧪 **Vitest** for fast unit testing with coverage reporting
- 🔍 **ESLint 9** with flat configuration and TypeScript support
- 💅 **Prettier** for consistent code formatting
- 🚀 **GitHub Actions** with matrix builds across Node.js versions
- 🪝 **Husky** git hooks for automated code quality checks
- 📊 **Native GitHub reporting** for test results and coverage

## Project Structure

```
pnpm-template/
├── packages/
│   └── lib/
│       ├── src/
│       │   └── index.ts          # Main library code
│       ├── test/
│       │   └── index.test.ts     # Unit tests
│       ├── package.json          # Package configuration
│       ├── tsconfig.json         # Source TypeScript config
│       ├── tsconfig.test.json    # Test TypeScript config
│       └── vitest.config.ci.ts   # CI-specific Vitest config
├── .github/workflows/ci.yml      # GitHub Actions workflow
├── .husky/                       # Git hooks
├── package.json                  # Root workspace config
├── pnpm-workspace.yaml          # Workspace configuration
├── tsconfig.json                # Root TypeScript config
├── vitest.config.ts             # Root Vitest config
├── eslint.config.js             # ESLint flat config
├── .prettierrc                  # Prettier configuration
└── .prettierignore              # Prettier ignore rules
```

## Development Workflow

### Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd pnpm-template

# Install dependencies
pnpm install

# Setup git hooks
pnpm prepare
```

### Development Scripts

#### Build Process

```bash
# Build all packages (TypeScript compilation)
pnpm build

# Typecheck all source and test files
pnpm typecheck

# Clean build artifacts
pnpm clean
```

#### Code Quality

```bash
# Run linting with auto-fix
pnpm lint:fix

# Check formatting
pnpm format:check

# Apply formatting
pnpm format
```

#### Testing

```bash
# Run all tests (build + typecheck + lint + format + test)
pnpm test

# Run tests in watch mode
pnpm -r test:watch

# Run tests with coverage
pnpm -r test:coverage

# Run CI-specific tests (with JUnit reporting)
pnpm test:ci
```

### Complete Development Workflow

The `pnpm test` command runs a complete development workflow:

1. **Build** (`pnpm build`) - Compiles TypeScript source files to `dist/`
2. **Typecheck** (`pnpm typecheck`) - Validates types in source and test files
3. **Lint & Fix** (`pnpm lint:fix`) - Runs Prettier and ESLint with auto-fix
4. **Format** (`pnpm format`) - Ensures consistent code formatting
5. **Test** (`pnpm -r test`) - Runs all Vitest tests across packages

### What Each Step Does

#### Build (`pnpm build`)

- Compiles TypeScript source files using `tsc`
- Generates JavaScript files in `dist/` directory
- Creates type declaration files (`.d.ts`)
- Generates source maps for debugging
- **Only compiles source files** - test files are typechecked separately

#### Typecheck (`pnpm typecheck`)

- Validates TypeScript types without generating files
- Checks both source and test files for type errors
- Uses separate `tsconfig.test.json` for comprehensive type checking
- Catches type errors before tests run

#### Lint & Format (`pnpm lint:fix`)

- **Prettier**: Formats code with consistent style
- **ESLint**: Checks for code quality issues and auto-fixes where possible
- Runs on all TypeScript and JavaScript files
- Excludes generated files and dependencies

#### Test (`pnpm -r test`)

- Runs Vitest in `run` mode (not watch mode)
- Executes all test files across all packages
- Provides fast feedback with detailed output
- Integrates with TypeScript for type checking in tests

## CI/CD Pipeline

### GitHub Actions Workflow

The CI pipeline runs on every push and pull request:

#### Matrix Testing

- **Node.js 20** (Latest LTS: Iron)
- **Node.js 22** (Latest LTS: Jod)
- **Node.js 24** (Latest stable)

#### Workflow Steps

1. **Setup** - Checkout code, setup Node.js and pnpm
2. **Cache** - Cache pnpm store for faster builds
3. **Install** - Install dependencies with frozen lockfile
4. **Lint** - Run ESLint and Prettier checks
5. **Format Check** - Verify code formatting
6. **Build** - Compile TypeScript packages
7. **Test** - Run tests with coverage and JUnit reporting
8. **Upload** - Upload coverage reports as artifacts
9. **Report** - Publish test results to GitHub's native reporting

#### Artifacts & Reporting

- **Coverage Reports**: Uploaded as downloadable artifacts
- **Test Results**: Published to GitHub's native test reporting
- **Rich Checks**: Coverage summaries in GitHub UI

### Local vs CI Testing

| Command                 | Local Development                        | CI Environment               |
| ----------------------- | ---------------------------------------- | ---------------------------- |
| `pnpm test`             | Full workflow with watch-friendly output | Same as local                |
| `pnpm test:ci`          | N/A                                      | Includes JUnit XML reporting |
| `pnpm -r test:coverage` | HTML coverage report                     | Coverage artifacts           |

## Configuration

### TypeScript

The project uses TypeScript with strict configuration and modern ES2022
features.

**Separate Configurations:**

- **Source Files** (`tsconfig.json`): Emits compiled JavaScript to `dist/`
- **Test Files** (`tsconfig.test.json`): Typechecks tests without emission
- **Root Config** (`tsconfig.json`): Workspace-wide settings

**Typechecking:**

- `pnpm typecheck` - Typechecks all source and test files
- `pnpm build` - Compiles source files only
- Test files are typechecked during `pnpm test` and `pnpm test:ci`

### ESLint

ESLint 9 flat config with TypeScript support and recommended rules.

### Prettier

Standard Prettier configuration with 2-space indentation and single quotes.

### Vitest

Fast unit testing with coverage reporting and Node.js environment.

### Husky

Git hooks for automated code quality checks and conventional commit messages.

## Git Hooks

### Pre-commit Hook

Automatically runs before each commit:

- Linting with auto-fix
- Code formatting
- All tests

### Commit-msg Hook

Validates commit messages follow conventional commit format:

- `feat: add new feature`
- `fix: resolve bug`
- `docs: update documentation`
- `style: format code`
- `refactor: restructure code`
- `test: add tests`
- `chore: maintenance tasks`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `pnpm test` to ensure everything works
5. Commit with a conventional commit message
6. Push and create a pull request

The CI pipeline will automatically:

- Test against multiple Node.js versions
- Check code quality and formatting
- Generate coverage reports
- Publish test results

## License

MIT
