class Greeter {
  public greeting: string;
  public constructor(message: string) {
    this.greeting = message;
  }
  public greet(): string {
    return 'Hello, from ' + this.greeting;
  }
}

export default Greeter;
