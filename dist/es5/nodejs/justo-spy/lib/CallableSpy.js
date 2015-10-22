//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _Calls = require("./Calls");

var _Calls2 = _interopRequireDefault(_Calls);

/**
 * A callable spy.
 *
 * @abstract
 * @attr(protected) callCount:number  The number of calls.
 * @readonly(protected) calls:Calls   The calls.
 */

var CallableSpy = (function () {
  /**
   * Constructor.
   */

  function CallableSpy() {
    _classCallCheck(this, CallableSpy);

    Object.defineProperty(this, "callCount", { value: 0, writable: true });
    Object.defineProperty(this, "calls", { value: new _Calls2["default"]() });
  }

  /**
   * Registers a call.
   *
   * @param call:Call The call to register.
   */

  _createClass(CallableSpy, [{
    key: "register",
    value: function register(call) {
      this.calls.add(call);
    }

    /**
     * @alias Calls.getCalls()
     */
  }, {
    key: "getCall",
    value: function getCall(i) {
      return this.calls.getCall(i);
    }

    /**
     * @alias Calls.getCalls()
     */
  }, {
    key: "getLastCall",
    value: function getLastCall() {
      return this.calls.getLastCall();
    }

    /**
     * @alias Calls.called()
     */
  }, {
    key: "called",
    value: function called() {
      return this.calls.called();
    }

    /**
     * @alias Calls.calledWith()
     */
  }, {
    key: "calledWith",
    value: function calledWith(args) {
      return this.calls.calledWith(args);
    }

    /**
     * @alias Calls.alwaysCalledWith()
     */
  }, {
    key: "alwaysCalledWith",
    value: function alwaysCalledWith(args) {
      return this.calls.alwaysCalledWith(args);
    }

    /**
     * @alias Calls.returned()
     */
  }, {
    key: "returned",
    value: function returned(value) {
      return this.calls.returned(value);
    }

    /**
     * @alias Calls.alwaysReturned()
     */
  }, {
    key: "alwaysReturned",
    value: function alwaysReturned(value) {
      return this.calls.alwaysReturned(value);
    }

    /**
     * @alias Calls.raised()
     */
  }, {
    key: "raised",
    value: function raised(error) {
      return this.calls.raised(error);
    }

    /**
     * @alias Calls.alwaysRaised()
     */
  }, {
    key: "alwaysRaised",
    value: function alwaysRaised(error) {
      return this.calls.alwaysRaised(error);
    }
  }]);

  return CallableSpy;
})();

exports["default"] = CallableSpy;
module.exports = exports["default"];
