"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}var 




Calls = function () {



  function Calls() {_classCallCheck(this, Calls);
    Object.defineProperty(this, "items", { value: [] });}_createClass(Calls, [{ key: "add", value: function add(
















    call) {
      this.items.push(call);} }, { key: "getCall", value: function getCall(













    i) {
      var call;

      if (arguments.length === 0 || i === undefined) {
        if (this.length === 0) call = undefined;else 
        if (this.length == 1) call = this.items[0];else 
        throw new Error("Several calls performed. Invoked as if only one performed.");} else 
      {
        call = this.items[i];}


      return call;} }, { key: "getArguments", value: function getArguments() 













    {
      var call = this.getCall.apply(this, arguments);
      return call ? call.arguments : undefined;} }, { key: "getLastCall", value: function getLastCall() 







    {
      return this.items[this.items.length - 1];} }, { key: "called", value: function called() 







    {
      return this.items.length;} }, { key: "calledWith", value: function calledWith(








    args) {
      var res = 0;


      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].calledWith(args)) res += 1;}



      return res;} }, { key: "alwaysCalledWith", value: function alwaysCalledWith(








    args) {
      var res;


      if (this.called() === 0) res = false;else 
      res = this.called() == this.calledWith(args);


      return res;} }, { key: "returned", value: function returned(













    value) {
      var res = 0;


      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].returned(value)) res += 1;}



      return res;} }, { key: "alwaysReturned", value: function alwaysReturned(













    value) {
      var res;


      if (this.called() === 0) res = false;else 
      res = this.called() == this.returned(value);


      return res;} }, { key: "raised", value: function raised(




















    error) {
      var res = 0;


      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].raised(error)) res += 1;}



      return res;} }, { key: "alwaysRaised", value: function alwaysRaised(




















    error) {
      var res;


      if (this.called() === 0) res = false;else 
      res = this.called() == this.raised(error);


      return res;} }, { key: "length", get: function get() {return this.items.length;} }]);return Calls;}();exports.default = Calls;
