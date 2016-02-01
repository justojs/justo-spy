"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _Calls = require("./Calls");var _Calls2 = _interopRequireDefault(_Calls);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 









CallableSpy = function () {



  function CallableSpy() {_classCallCheck(this, CallableSpy);
    Object.defineProperty(this, "callCount", { value: 0, writable: true });
    Object.defineProperty(this, "calls", { value: new _Calls2.default() });}_createClass(CallableSpy, [{ key: "register", value: function register(







    call) {
      this.calls.add(call);} }, { key: "getCall", value: function getCall() 





    {var _calls;
      return (_calls = this.calls).getCall.apply(_calls, arguments);} }, { key: "getArguments", value: function getArguments() 





    {var _calls2;
      return (_calls2 = this.calls).getArguments.apply(_calls2, arguments);} }, { key: "getLastCall", value: function getLastCall() 





    {
      return this.calls.getLastCall();} }, { key: "called", value: function called() 





    {
      return this.calls.called();} }, { key: "calledWith", value: function calledWith(





    args) {
      return this.calls.calledWith(args);} }, { key: "alwaysCalledWith", value: function alwaysCalledWith(





    args) {
      return this.calls.alwaysCalledWith(args);} }, { key: "returned", value: function returned(





    value) {
      return this.calls.returned(value);} }, { key: "alwaysReturned", value: function alwaysReturned(





    value) {
      return this.calls.alwaysReturned(value);} }, { key: "raised", value: function raised(





    error) {
      return this.calls.raised(error);} }, { key: "alwaysRaised", value: function alwaysRaised(





    error) {
      return this.calls.alwaysRaised(error);} }]);return CallableSpy;}();exports.default = CallableSpy;
