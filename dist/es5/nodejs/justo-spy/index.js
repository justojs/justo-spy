"use strict";var _FunctionSpy = require("./lib/FunctionSpy");var _FunctionSpy2 = _interopRequireDefault(_FunctionSpy);var _ObjectSpy = require("./lib/ObjectSpy");var _ObjectSpy2 = _interopRequireDefault(_ObjectSpy);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}




module.exports = spy;














function spy() {
  var res;


  if (arguments.length === 0) {
    res = createFunctionSpy(function () {});} else 
  {
    if ((arguments.length <= 0 ? undefined : arguments[0]) instanceof Function) res = createFunctionSpy(arguments.length <= 0 ? undefined : arguments[0]);else 
    res = createObjectSpy.apply(undefined, arguments);}



  return res;}







function createFunctionSpy(fn) {
  var res, mon;


  mon = new _FunctionSpy2.default(fn);

  res = function res() {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
    return mon.call(args);};


  Object.defineProperty(res, "spy", { value: mon });
  Object.defineProperty(res, "toString", { value: function value() {return fn.toString();}, enumerable: true });


  return res;}








function createObjectSpy(obj) {var mems = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  if (typeof mems == "string") mems = [mems];


  Object.defineProperty(obj, "spy", { value: new _ObjectSpy2.default(obj) });


  for (var i = 0; i < mems.length; ++i) {
    obj.spy.monitor(mems[i]);}



  return obj;}
