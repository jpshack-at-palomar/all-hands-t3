/* eslint-env node */
/* eslint-disable no-undef, no-console */
import { runCommand as oclifRunCommand } from '@oclif/test';
import { Config } from '@oclif/core';

// oclif testing utilities wrapper for CLI commands
export class OclifTestUtils {
  private static config: Config;

  static async initialize(): Promise<void> {
    if (!this.config) {
      this.config = await Config.load();
    }
  }

  static async runCommand(args: string[]): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    exitCode?: number;
  }> {
    await this.initialize();

    try {
      const result = await oclifRunCommand(args, {
        root: process.cwd(),
        config: this.config,
      });

      return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        exitCode: result.error ? 1 : 0,
        error: result.error,
      };
    } catch (error) {
      return {
        stdout: '',
        stderr: error instanceof Error ? error.message : String(error),
        error: error instanceof Error ? error : new Error(String(error)),
        exitCode: 1,
      };
    }
  }

  static async captureOutput<T>(fn: () => Promise<T>): Promise<{
    result: T;
    stdout: string;
    stderr: string;
    error?: Error;
  }> {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    let stdout = '';
    let stderr = '';
    let error: Error | undefined;

    // Capture console output
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log = (...args: any[]) => {
      stdout += args.join(' ') + '\n';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error = (...args: any[]) => {
      stderr += args.join(' ') + '\n';
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.warn = (...args: any[]) => {
      stderr += args.join(' ') + '\n';
    };

    let result: T;

    try {
      result = await fn();
    } catch (err) {
      error = err instanceof Error ? err : new Error(String(err));
      throw error;
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    }

    return {
      result,
      stdout,
      stderr,
      error,
    };
  }

  static mockUserInput(inputs: string[]): NodeJS.ReadableStream {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Readable } = require('stream');

    const inputStream = new Readable({
      read() {
        if (inputs.length > 0) {
          this.push(inputs.shift() + '\n');
        } else {
          this.push(null);
        }
      },
    });

    return inputStream;
  }

  static async simulateInteractiveCommand(
    args: string[],
    userInputs: string[]
  ): Promise<{
    stdout: string;
    stderr: string;
    error?: Error;
    exitCode?: number;
  }> {
    const originalStdin = process.stdin;

    try {
      // Mock stdin with user inputs
      const mockStdin = this.mockUserInput(userInputs);
      Object.defineProperty(process, 'stdin', {
        value: mockStdin,
        configurable: true,
      });

      return await this.runCommand(args);
    } finally {
      // Restore original stdin
      Object.defineProperty(process, 'stdin', {
        value: originalStdin,
        configurable: true,
      });
    }
  }
}
