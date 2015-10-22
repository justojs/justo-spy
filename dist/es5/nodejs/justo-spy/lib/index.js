//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = spy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _FunctionSpy = require("./FunctionSpy");

var _FunctionSpy2 = _interopRequireDefault(_FunctionSpy);

var _ObjectSpy = require("./ObjectSpy");

var _ObjectSpy2 = _interopRequireDefault(_ObjectSpy);

/**
 * Creates a double to spy an object.
 *
 * @overload Dummy function spy.
 * @noparam
 *
 * @overload Function spy.
 * @param fn:function      The function to spy.
 *
 * @overload Object spy.
 * @param obj:object              The object to spy.
 * @param [mems]:string|string[]  The members to spy.
 */

function spy() {
  var res;

  //(1) create spy

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) {
    res = createFunctionSpy(function () {});
  } else {
    if (args[0] instanceof Function) res = createFunctionSpy(args[0]);else res = createObjectSpy.apply(undefined, args);
  }

  //(2) return
  return res;
}

/**
 * Creates a double to spy a function.
 *
 * @param fn:function  The function to spy.
 */
function createFunctionSpy(fn) {
  var res, mon;

  //(1) create spy
  mon = new _FunctionSpy2["default"](fn);

  res = function () {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return mon.call(args);
  };

  Object.defineProperty(res, "spy", { value: mon });
  Object.defineProperty(res, "toString", { value: function value() {
      return fn.toString();
    }, enumerable: true });

  //(2) return
  return res;
}

/**
 * Creates a double to spy an object.
 *
 * @param obj:object            The object to spy.
 * @param mems:string|string[]  The members to spy.
 */
function createObjectSpy(obj) {
  var mems = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  //(1) arguments
  if (typeof mems == "string") mems = [mems];

  //(2) create spy
  Object.defineProperty(obj, "spy", { value: new _ObjectSpy2["default"](obj) });

  //(3) monitor members
  for (var i = 0; i < mems.length; ++i) {
    obj.spy.monitor(mems[i]);
  }

  //(4) add
  return obj;
}
module.exports = exports["default"];
