"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _CallableSpy2 = require("./CallableSpy");var _CallableSpy3 = _interopRequireDefault(_CallableSpy2);var _FunctionCall = require("./FunctionCall");var _FunctionCall2 = _interopRequireDefault(_FunctionCall);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 








FunctionSpy = function (_CallableSpy) {_inherits(FunctionSpy, _CallableSpy);





  function FunctionSpy(fn) {_classCallCheck(this, FunctionSpy);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FunctionSpy).call(this));

    Object.defineProperty(_this, "fn", { value: fn });return _this;}_createClass(FunctionSpy, [{ key: "call", value: function call(








    args) {
      var callNo, error, value;


      try {
        callNo = this.callCount;
        value = this.fn.apply(this.fn, args);} 
      catch (e) {
        error = e;} finally 
      {
        this.callCount += 1;}



      this.register(new _FunctionCall2.default(callNo, args, value, error));


      if (error) throw error;else 
      return value;} }]);return FunctionSpy;}(_CallableSpy3.default);exports.default = FunctionSpy;
