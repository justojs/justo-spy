//imports
const deepEqual = require("deep-equal");

/**
 * A call.
 *
 * @abstract
 * @readonly callNo:number      The number of call.
 * @readonly value:object       The value returned.
 * @readonly error:object       The error raised.
 */
export default class Call {
  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr) value
   * @param(attr) error
   */
  constructor(callNo, value, error) {
    Object.defineProperty(this, "callNo", {value: callNo, enumerable: true});
    Object.defineProperty(this, "value", {value: value, enumerable: true});
    Object.defineProperty(this, "error", {value: error, enumerable: true});
  }

  /**
   * Checks whether the call returned a value.
   *
   * @overload
   * @noparam
   * @return boolean
   *
   * @overload
   * @param value:object  The value returned.
   * @return boolean
   */
  returned(value) {
    var res;

    //(1) check
    if (!this.error) {
      if (value === undefined || value === null) res = true;
      else res = deepEqual(this.value, value);
    } else {
      res = false;
    }

    //(2) return
    return res;
  }

  /**
   * Checks whether the call raised an error.
   *
   * @overload
   * @noparam
   * @return boolean
   *
   * @overload
   * @param msg:string    The error message.
   * @return boolean
   *
   * @overload
   * @param msg:RegExp  The error message.
   * @return boolean
   *
   * @overload
   * @param error:object  The object raised.
   * @return boolean
   */
  raised(error) {
    var res;

    //(1) check
    if (this.error) {
      if (error) {
        if (error.hasOwnProperty("message")) res = (this.error.message == error.message);
        else if (error instanceof RegExp) res = error.test(this.error.message);
        else res = (this.error.message == error);
      } else {
        res = true;
      }
    } else {
      res = false;
    }

    //(2) return
    return res;
  }
}
