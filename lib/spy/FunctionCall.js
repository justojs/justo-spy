/**
 * A call of a function or method.
 *
 * @param arguments:object[] The arguments passed to the call.
 */
class FunctionCall extends Call {
  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr=arguments) args
   * @param(attr) value
   * @param(attr) error
   */
  constructor(callNo, args, value, error) {
    super(callNo, value, error);
    Object.defineProperty(this, "arguments", {value: args, enumerable: true});
  }

  /**
   * Checks whether the call was done with the specified arguments.
   *
   * @param args:object[] The arguments.
   * @return boolean
   */
  calledWith(args) {
    return deepEqual(this.arguments, args);
  }
}
