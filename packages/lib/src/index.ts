export class HelloWorld {
  private name: string;

  constructor(name: string = 'World') {
    this.name = name;
  }

  public sayHello(): string {
    return `Hello, ${this.name}!`;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }
}

export default HelloWorld;
