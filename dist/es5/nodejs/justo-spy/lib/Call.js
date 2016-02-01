"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}
var deepEqual = require("deep-equal");var 









Call = function () {







  function Call(callNo, value, error) {_classCallCheck(this, Call);
    Object.defineProperty(this, "callNo", { value: callNo, enumerable: true });
    Object.defineProperty(this, "value", { value: value, enumerable: true });
    Object.defineProperty(this, "error", { value: error, enumerable: true });}_createClass(Call, [{ key: "returned", value: function returned(













    value) {
      var res;


      if (!this.error) {
        if (value === undefined || value === null) res = true;else 
        res = deepEqual(this.value, value);} else 
      {
        res = false;}



      return res;} }, { key: "raised", value: function raised(





















    error) {
      var res;


      if (this.error) {
        if (error) {
          if (error.hasOwnProperty("message")) res = this.error.message == error.message;else 
          if (error instanceof RegExp) res = error.test(this.error.message);else 
          res = this.error.message == error;} else 
        {
          res = true;}} else 

      {
        res = false;}



      return res;} }]);return Call;}();exports.default = Call;
