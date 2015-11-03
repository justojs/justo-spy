/**
 * A collection of calls.
 *
 * @readonly(protected) items:Call[]  The calls.
 */
export default class Calls {
  /**
   * Constructor.
   */
  constructor() {
    Object.defineProperty(this, "items", {value: []});
  }

  /**
   * The number of calls.
   *
   * @type number
   */
  get length() {
    return this.items.length;
  }

  /**
   * Adds a new call.
   *
   * @param call:Call The call to add/register.
   */
  add(call) {
    this.items.push(call);
  }

  /**
   * Returns the call specified.
   *
   * @overload The only one.
   * @noparam
   * @return Call
   *
   * @overload
   * @param i:number  The position.
   * @return Call
   */
  getCall(i) {
    var call;

    if (arguments.length === 0 || i === undefined) {
      if (this.length === 0) call = undefined;
      else if (this.length == 1) call = this.items[0];
      else throw new Error("Several calls performed. Invoked as if only one performed.");
    } else {
      call = this.items[i];
    }

    return call;
  }

  /**
   * Returns the last call.
   *
   * @return Call
   */
  getLastCall() {
    return this.items[this.items.length-1];
  }

  /**
   * Checks the number of calls.
   *
   * @return number
   */
  called() {
    return this.items.length;
  }

  /**
   * Checks the number of calls that received the specified arguments.
   *
   * @param args:object[] The arguments to check.
   * @return number
   */
  calledWith(args) {
    var res = 0;

    //(1) check
    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].calledWith(args)) res += 1;
    }

    //(2) return
    return res;
  }

  /**
   * Checks whether all calls were with the passed arguments.
   *
   * @param args:object[] The arguments passed to check.
   * @return boolean
   */
  alwaysCalledWith(args) {
    var res;

    //(1) check
    if (this.called() === 0) res = false;
    else res = (this.called() == this.calledWith(args));

    //(2) return
    return res;
  }

  /**
   * Returns the number of calls that returned value.
   *
   * @overload
   * @noparam
   * @return number
   *
   * @overload
   * @param value:object  The value returned.
   * @return number
   */
  returned(value) {
    var res = 0;

    //(1) check
    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].returned(value)) res += 1;
    }

    //(2) return
    return res;
  }

  /**
   * Checks whether all calls returned a value.
   *
   * @overload
   * @noparam
   * @return boolean

   * @overload
   * @param value:object  The value returned.
   * @return boolean
   */
  alwaysReturned(value) {
    var res;

    //(1) check
    if (this.called() === 0) res = false;
    else res = (this.called() == this.returned(value));

    //(2) return
    return res;
  }

  /**
   * Returns the number of calls that raised error.
   *
   * @overload
   * @noparam
   * @return number
   *
   * @overload
   * @param error:string  The error message.
   * @return number
   *
   * @overload
   * @param msg:RegExp    The error message.
   *
   * @overload
   * @param error:object  The error raised.
   * @return number
   */
  raised(error) {
    var res = 0;

    //(1) check
    for (let i = 0; i < this.items.length; ++i) {
      if (this.items[i].raised(error)) res += 1;
    }

    //(2) return
    return res;
  }

  /**
   * Checks whether all calls raised error.
   *
   * @overload
   * @noparam
   * @return boolean
   *
   * @overload
   * @param error:string  The error message.
   * @return boolean
   *
   * @overload
   * @param error:RegExp  The error message.
   *
   * @overload
   * @param error:object  The error.
   * @return boolean
   */
  alwaysRaised(error) {
    var res;

    //(1) check
    if (this.called() === 0) res = false;
    else res = (this.called() == this.raised(error));

    //(2) return
    return res;
  }
}
