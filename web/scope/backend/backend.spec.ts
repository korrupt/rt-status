import { Backend } from './backend.js';

describe('backend', () => {
  it('should say hello', async () => {
    const backend = Backend.from();
    const greeting = await backend.getHello();
    expect(greeting).toEqual('Hello World!');
  })
});
    