import { describe, it, expect } from 'vitest';
import { HelloWorld } from '../src/index';

describe('HelloWorld', () => {
  it('should create a HelloWorld instance with default name', () => {
    const hello = new HelloWorld();
    expect(hello.getName()).toBe('World');
  });

  it('should create a HelloWorld instance with custom name', () => {
    const hello = new HelloWorld('Alice');
    expect(hello.getName()).toBe('Alice');
  });

  it('should say hello with default name', () => {
    const hello = new HelloWorld();
    expect(hello.sayHello()).toBe('Hello, World!');
  });

  it('should say hello with custom name', () => {
    const hello = new HelloWorld('Bob');
    expect(hello.sayHello()).toBe('Hello, Bob!');
  });

  it('should allow setting a new name', () => {
    const hello = new HelloWorld('Alice');
    hello.setName('Charlie');
    expect(hello.getName()).toBe('Charlie');
    expect(hello.sayHello()).toBe('Hello, Charlie!');
  });

  it('should handle empty string name', () => {
    const hello = new HelloWorld('');
    expect(hello.sayHello()).toBe('Hello, !');
  });
});
