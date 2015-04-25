/**
 * Spy on a function.
 *
 * @readonly(protected)  fn:function    The function to spy.
 */
class FunctionSpy extends CallableSpy {
  /**
   * Constructor.
   *
   * @param(attr) fn
   */
  constructor(fn) {
    super();
    Object.defineProperty(this, "fn", {value: fn});
  }

  /**
   * Calls the function.
   *
   * @internal
   * @param args:object[]  The arguments passed to the call.
   */
  call(args) {
    var callNo, error, value;

    //(1) invoke
    try {
      callNo = this.callCount;
      value = this.fn.apply(this.fn, args);
    } catch (e) {
      error = e;
    } finally {
      this.callCount += 1;
    }

    //(2) register
    this.register(new FunctionCall(callNo, args, value, error));

    //(3) return
    if (error) throw error;
    else return value;
  }
}
