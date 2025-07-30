/* eslint-env node */
/* eslint-disable no-undef */
import { describe, it, expect } from 'vitest';
import { CLITestUtils } from './test-utils.js';
import { OclifTestUtils } from './oclif-test-utils.js';

describe('Test Utils', () => {
  describe('CLITestUtils', () => {
    describe('Grid Position Utilities', () => {
      it('should provide valid grid positions', () => {
        const validPositions = CLITestUtils.getValidGridPositions();

        expect(validPositions).toHaveLength(9);
        expect(validPositions).toEqual([
          'A1',
          'A2',
          'A3',
          'B1',
          'B2',
          'B3',
          'C1',
          'C2',
          'C3',
        ]);
      });

      it('should provide invalid grid positions for testing', () => {
        const invalidPositions = CLITestUtils.getInvalidGridPositions();

        expect(invalidPositions.length).toBeGreaterThan(0);
        expect(invalidPositions).toContain('A4');
        expect(invalidPositions).toContain('D1');
        expect(invalidPositions).toContain('');
      });
    });

    describe('Move Sequences', () => {
      it('should provide winning sequence for X', () => {
        const sequence = CLITestUtils.getWinningSequenceX();

        expect(sequence).toHaveLength(5);
        expect(sequence).toEqual(['A1', 'B1', 'A2', 'B2', 'A3']);
      });

      it('should provide winning sequence for O', () => {
        const sequence = CLITestUtils.getWinningSequenceO();

        expect(sequence).toHaveLength(6);
        expect(sequence[sequence.length - 1]).toBe('B3');
      });

      it('should provide draw sequence', () => {
        const sequence = CLITestUtils.getDrawSequence();

        expect(sequence).toHaveLength(9);
        // Should contain all valid positions
        const validPositions = CLITestUtils.getValidGridPositions();
        sequence.forEach((move) => {
          expect(validPositions).toContain(move as never);
        });
      });
    });

    describe('Output Parsing', () => {
      it('should parse game result with winner', () => {
        const output = `
=== Game Result ===
Winner: X
Moves: X:A1, O:B2, X:C3
        `;

        const result = CLITestUtils.parseGameResult(output);

        expect(result).not.toBeNull();
        expect(result?.winner).toBe('X');
        expect(result?.isDraw).toBe(false);
        expect(result?.moves).toHaveLength(3);
        expect(result?.moves[0]).toEqual({
          player: 'X',
          position: 'A1',
          turn: 1,
        });
      });

      it('should parse game result with draw', () => {
        const output = `
=== Game Result ===
Winner: Draw
Moves: X:A1, O:A2, X:A3
        `;

        const result = CLITestUtils.parseGameResult(output);

        expect(result).not.toBeNull();
        expect(result?.winner).toBeNull();
        expect(result?.isDraw).toBe(true);
      });

      it('should return null for invalid game output', () => {
        const output = 'Invalid output format';

        const result = CLITestUtils.parseGameResult(output);

        expect(result).toBeNull();
      });

      it('should parse match result', () => {
        const output = `
=== Match Result ===
Games played: 3
Human wins: 2
AI wins: 1
Draws: 0
Match winner: human
        `;

        const result = CLITestUtils.parseMatchResult(output);

        expect(result).not.toBeNull();
        expect(result?.humanWins).toBe(2);
        expect(result?.aiWins).toBe(1);
        expect(result?.draws).toBe(0);
        expect(result?.winner).toBe('human');
      });

      it('should return null for invalid match output', () => {
        const output = 'Invalid match output';

        const result = CLITestUtils.parseMatchResult(output);

        expect(result).toBeNull();
      });
    });

    describe('Performance Testing', () => {
      it('should measure command performance', async () => {
        // Mock a simple command that should execute quickly
        const mockCommand = ['--help'];

        const performance = await CLITestUtils.measureCommandPerformance(
          mockCommand,
          1000 // 1 second limit
        );

        expect(performance.executionTime).toBeGreaterThan(0);
        expect(typeof performance.withinLimit).toBe('boolean');
        expect(performance.result).toBeDefined();
      });

      it('should handle command timeout', async () => {
        // This test verifies timeout functionality works
        const result = await CLITestUtils.runCommandWithTimeout(
          ['non-existent-command'],
          100 // Very short timeout
        );

        expect(typeof result.timedOut).toBe('boolean');
        expect(result.stdout).toBeDefined();
        expect(result.stderr).toBeDefined();
      });
    });
  });

  describe('OclifTestUtils', () => {
    describe('Command Execution', () => {
      it('should execute commands and return structured results', async () => {
        const result = await OclifTestUtils.runCommand(['--help']);

        expect(result).toHaveProperty('stdout');
        expect(result).toHaveProperty('stderr');
        expect(result).toHaveProperty('exitCode');
        expect(typeof result.stdout).toBe('string');
        expect(typeof result.stderr).toBe('string');
      });

      it('should handle command errors gracefully', async () => {
        const result = await OclifTestUtils.runCommand(['invalid-command']);

        expect(result.error).toBeDefined();
        expect(result.exitCode).toBe(1);
      });
    });

    describe('Output Capture', () => {
      it('should capture output from async functions', async () => {
        const testFunction = async () => {
          console.log('Test output');
          console.error('Test error');
          return 'function result';
        };

        const captured = await OclifTestUtils.captureOutput(testFunction);

        expect(captured.result).toBe('function result');
        expect(captured.stdout).toContain('Test output');
        expect(captured.stderr).toContain('Test error');
      });

      it('should handle errors in captured functions', async () => {
        const errorFunction = async () => {
          throw new Error('Test error');
        };

        try {
          await OclifTestUtils.captureOutput(errorFunction);
          expect(true).toBe(false); // Should not reach here
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
          expect((error as Error).message).toBe('Test error');
        }
      });
    });

    describe('User Input Simulation', () => {
      it('should create readable stream from user inputs', () => {
        const inputs = ['A1', 'B2', 'C3'];
        const stream = OclifTestUtils.mockUserInput([...inputs]);

        expect(stream).toBeDefined();
        expect(typeof stream.read).toBe('function');
      });

      it('should simulate interactive commands', async () => {
        // This is a basic test - we'll need actual commands implemented to test fully
        const result = await OclifTestUtils.simulateInteractiveCommand(
          ['--help'],
          ['test-input']
        );

        expect(result).toHaveProperty('stdout');
        expect(result).toHaveProperty('stderr');
      });
    });

    describe('Configuration', () => {
      it('should initialize oclif config', async () => {
        // Test that initialization doesn't throw errors
        await expect(OclifTestUtils.initialize()).resolves.not.toThrow();
      });
    });
  });

  describe('Integration', () => {
    it('should work together for comprehensive testing', () => {
      // Verify that CLITestUtils properly uses OclifTestUtils
      expect(typeof CLITestUtils.runNewCommand).toBe('function');
      expect(typeof CLITestUtils.runMatchCommand).toBe('function');
      expect(typeof CLITestUtils.simulateGame).toBe('function');

      // Verify helper methods exist
      expect(typeof CLITestUtils.getValidGridPositions).toBe('function');
      expect(typeof CLITestUtils.parseGameResult).toBe('function');
      expect(typeof CLITestUtils.measureCommandPerformance).toBe('function');
    });
  });
});
