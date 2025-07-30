# All Hands T3 - Tic-Tac-Toe Game

A TypeScript-based tic-tac-toe game built as a 3-hour technical assessment. The
project demonstrates modern development practices with a monorepo structure,
comprehensive testing, and AI-assisted development.

## Running the App

```bash
# Clone and setup
git clone https://github.com/jpshack-at-palomar/all-hands-t3.git
cd all-hands-t3
git checkout jps/cli2
pnpm install

# Run tests to verify everything works
pnpm test

# Build and play the game
cd packages/cli2
pnpm build
./bin/run.js game --mode human-vs-ai
```

## Approach

The project was built using a monorepo with `lib` component designed to support
multiple UI experiences:

- **`packages/lib/`**: Core game engine with 152+ passing tests and 97.56% code
  coverage
  - Modular design allowing the same game logic to power different interfaces
  - Clean separation between game state, player logic, and UI concerns
- **`packages/cli2/`**: Command-line interface built with Oclif framework
- **Parallel UI development**: Multiple interface designs (CLI, React, Fastify
  server) were developed simultaneously

The development was divided into six 30-minute milestones, emphasizing rapid
iteration and risk management. The approach focused on building a reusable game
library first, then developing multiple UI experiences in parallel to see which
would land before the time was up. This strategy maximized the chance of having
impressive features to show while managing the time constraint.

## AI Tools Used

- **Cursor AI**: Primary development assistant for code generation and
  refactoring
- **Gemini Code Assist**: Code review and quality analysis

## What Didn't Go as Planned

**Design Document Overhead**: The comprehensive design document approach, while
effective for longer projects, created too much overhead for a 3-hour timeline.
This slowed iteration cycles and delayed getting to a playable prototype.

**Risk Management Issues**: Despite having code and tests in the `lib` project
we didn't achieve a playable game until the final minutes. The focus on parallel
development and came at the cost of early validation.

**Agent Coordination**: Background AI agents created coordination challenges and
performance bottlenecks, requiring manual intervention and pivots to direct
implementation.

## Project Summary

For detailed information about the development process, video recordings, and
comprehensive analysis, see [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md).
