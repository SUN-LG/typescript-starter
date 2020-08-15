class Greeter {
  greeting: string;
  constructor(message: string) {
      this.greeting = message;
  }
  greet(): string {
      return "Hello, " + this.greeting;
  }
}

export default Greeter
