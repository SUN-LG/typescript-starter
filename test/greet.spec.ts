import Greeter from '@/greet';

describe('src/greet.ts', () => {
  it('name param test', () => {
    const greeter = new Greeter('world');

    expect(greeter.greet()).toBe('Hello, from world');
  });
});
