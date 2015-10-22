/**
 * A collection of calls.
 *
 * @readonly(protected) items:Call[]  The calls.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calls = (function () {
  /**
   * Constructor.
   */

  function Calls() {
    _classCallCheck(this, Calls);

    Object.defineProperty(this, "items", { value: [] });
  }

  /**
   * The number of calls.
   *
   * @type number
   */

  _createClass(Calls, [{
    key: "add",

    /**
     * Adds a new call.
     *
     * @param call:Call The call to add/register.
     */
    value: function add(call) {
      this.items.push(call);
    }

    /**
     * Returns the call specified.
     *
     * @param i:number  The position.
     * @return Call
     */
  }, {
    key: "getCall",
    value: function getCall(i) {
      return this.items[i];
    }

    /**
     * Returns the last call.
     *
     * @return Call
     */
  }, {
    key: "getLastCall",
    value: function getLastCall() {
      return this.items[this.items.length - 1];
    }

    /**
     * Checks the number of calls.
     *
     * @return number
     */
  }, {
    key: "called",
    value: function called() {
      return this.items.length;
    }

    /**
     * Checks the number of calls that received the specified arguments.
     *
     * @param args:object[] The arguments to check.
     * @return number
     */
  }, {
    key: "calledWith",
    value: function calledWith(args) {
      var res = 0;

      //(1) check
      for (var i = 0; i < this.items.length; ++i) {
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
  }, {
    key: "alwaysCalledWith",
    value: function alwaysCalledWith(args) {
      var res;

      //(1) check
      if (this.called() === 0) res = false;else res = this.called() == this.calledWith(args);

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
  }, {
    key: "returned",
    value: function returned(value) {
      var res = 0;

      //(1) check
      for (var i = 0; i < this.items.length; ++i) {
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
  }, {
    key: "alwaysReturned",
    value: function alwaysReturned(value) {
      var res;

      //(1) check
      if (this.called() === 0) res = false;else res = this.called() == this.returned(value);

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
  }, {
    key: "raised",
    value: function raised(error) {
      var res = 0;

      //(1) check
      for (var i = 0; i < this.items.length; ++i) {
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
  }, {
    key: "alwaysRaised",
    value: function alwaysRaised(error) {
      var res;

      //(1) check
      if (this.called() === 0) res = false;else res = this.called() == this.raised(error);

      //(2) return
      return res;
    }
  }, {
    key: "length",
    get: function get() {
      return this.items.length;
    }
  }]);

  return Calls;
})();

exports["default"] = Calls;
module.exports = exports["default"];
