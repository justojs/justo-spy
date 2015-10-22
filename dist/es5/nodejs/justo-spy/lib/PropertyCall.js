//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _Call2 = require("./Call");

var _Call3 = _interopRequireDefault(_Call2);

/**
 * A call on a property.
 *
 * @readonly accessor:string  Accessor type: get or set.
 */

var PropertyCall = (function (_Call) {
  _inherits(PropertyCall, _Call);

  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr) accessor
   * @param(attr) value
   * @param(attr) error
   */

  function PropertyCall(callNo, accessor, value, error) {
    _classCallCheck(this, PropertyCall);

    _get(Object.getPrototypeOf(PropertyCall.prototype), "constructor", this).call(this, callNo, value, error);
    Object.defineProperty(this, "accessor", { value: accessor, enumerable: true });
  }

  return PropertyCall;
})(_Call3["default"]);

exports["default"] = PropertyCall;
module.exports = exports["default"];
