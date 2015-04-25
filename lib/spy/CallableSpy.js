/**
 * A callable spy.
 *
 * @abstract
 * @attr(protected) callCount:number  The number of calls.
 * @readonly(protected) calls:Calls   The calls.
 */
class CallableSpy {
  /**
   * Constructor.
   */
  constructor() {
    Object.defineProperty(this, "callCount", {value: 0, writable: true});
    Object.defineProperty(this, "calls", {value: new Calls()});
  }

  /**
   * Registers a call.
   *
   * @param call:Call The call to register.
   */
  register(call) {
    this.calls.add(call);
  }

  /**
   * @alias Calls.getCalls()
   */
  getCall(i) {
    return this.calls.getCall(i);
  }

  /**
   * @alias Calls.getCalls()
   */
  getLastCall() {
    return this.calls.getLastCall();
  }

  /**
   * @alias Calls.called()
   */
  called() {
    return this.calls.called();
  }

  /**
   * @alias Calls.calledWith()
   */
  calledWith(args) {
    return this.calls.calledWith(args);
  }

  /**
   * @alias Calls.alwaysCalledWith()
   */
  alwaysCalledWith(args) {
    return this.calls.alwaysCalledWith(args);
  }

  /**
   * @alias Calls.returned()
   */
  returned(value) {
    return this.calls.returned(value);
  }

  /**
   * @alias Calls.alwaysReturned()
   */
  alwaysReturned(value) {
    return this.calls.alwaysReturned(value);
  }

  /**
   * @alias Calls.raised()
   */
  raised(error) {
    return this.calls.raised(error);
  }

  /**
   * @alias Calls.alwaysRaised()
   */
  alwaysRaised(error) {
    return this.calls.alwaysRaised(error);
  }
}