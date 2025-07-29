# pnpm-template

A comprehensive pnpm workspace template with TypeScript, Vitest, ESLint, Prettier, and GitHub Actions CI/CD.

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

| Command | Local Development | CI Environment |
|---------|------------------|----------------|
| `pnpm test` | Full workflow with watch-friendly output | Same as local |
| `pnpm test:ci` | N/A | Includes JUnit XML reporting |
| `pnpm -r test:coverage` | HTML coverage report | Coverage artifacts |

## Configuration

### TypeScript

The project uses TypeScript with strict configuration and modern ES2022 features.

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
