//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _CallableSpy2 = require("./CallableSpy");

var _CallableSpy3 = _interopRequireDefault(_CallableSpy2);

var _FunctionCall = require("./FunctionCall");

var _FunctionCall2 = _interopRequireDefault(_FunctionCall);

/**
 * Spy on a function.
 *
 * @readonly(protected)  fn:function    The function to spy.
 */

var FunctionSpy = (function (_CallableSpy) {
  _inherits(FunctionSpy, _CallableSpy);

  /**
   * Constructor.
   *
   * @param(attr) fn
   */

  function FunctionSpy(fn) {
    _classCallCheck(this, FunctionSpy);

    _get(Object.getPrototypeOf(FunctionSpy.prototype), "constructor", this).call(this);
    Object.defineProperty(this, "fn", { value: fn });
  }

  /**
   * Calls the function.
   *
   * @internal
   * @param args:object[]  The arguments passed to the call.
   */

  _createClass(FunctionSpy, [{
    key: "call",
    value: function call(args) {
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
      this.register(new _FunctionCall2["default"](callNo, args, value, error));

      //(3) return
      if (error) throw error;else return value;
    }
  }]);

  return FunctionSpy;
})(_CallableSpy3["default"]);

exports["default"] = FunctionSpy;
module.exports = exports["default"];