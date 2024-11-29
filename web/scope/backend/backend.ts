
/**
 * backend
 */
export class Backend {
  
  /**
   * say hello.
   */
  async getHello() {
    return 'Hello World!';
  }

  /**
   * create a new instance of a backend.
   */
  static from() {
    return new Backend();
  }
}
