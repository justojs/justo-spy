"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _FunctionSpy = require("./FunctionSpy");var _FunctionSpy2 = _interopRequireDefault(_FunctionSpy);var _PropertySpy = require("./PropertySpy");var _PropertySpy2 = _interopRequireDefault(_PropertySpy);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}




var monitorProperty = Symbol();
var monitorDummyMethod = Symbol();
var monitorMethod = Symbol();
var getDouble = Symbol();var 







ObjectSpy = function () {





  function ObjectSpy(object) {_classCallCheck(this, ObjectSpy);
    Object.defineProperty(this, "object", { value: object });
    Object.defineProperty(this, "members", { value: {} });}_createClass(ObjectSpy, [{ key: "monitor", value: function monitor(







    name) {
      var PROP = /^@/;
      var DUMMY = /\(\) *{}$/;
      var METHOD = /\(\)$/;

      if (PROP.test(name)) this[monitorProperty](name.replace(PROP, ""));else 
      if (DUMMY.test(name)) this[monitorDummyMethod](name.replace(DUMMY, ""));else 
      if (METHOD.test(name)) this[monitorMethod](name.replace(METHOD, ""));else 
      throw new Error("Member name must be 'method()' or '@attr'. Received: " + name + ".");} }, { key: 








    monitorProperty, value: function value(name) {
      var double;


      double = new _PropertySpy2.default(this.object, name);


      Object.defineProperty(this.object, 
      name, 
      { 
        get: function get() {return double.getValue();}, 
        set: function set(value) {return double.setValue(value);} });




      this.members[name] = double;} }, { key: 








    monitorDummyMethod, value: function value(name) {
      var double, mon, desc;


      double = new _FunctionSpy2.default(function () {});
      mon = function mon() {for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
        return double.call(args);};

      Object.defineProperty(mon, "spy", { value: double });


      desc = Object.getOwnPropertyDescriptor(this.object, name);

      if (!desc) {
        Object.defineProperty(this.object, name, { value: mon });} else 
      {
        if (desc.writable) this.object[name] = mon;else 
        throw new Error("Object has defined an own '" + name + "' member as read-only. It can't be spied.");}



      this.members[name] = double;} }, { key: 








    monitorMethod, value: function value(name) {
      var double, mon, desc;


      double = new _FunctionSpy2.default(this.object[name].bind(this.object));
      mon = function mon() {for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {args[_key2] = arguments[_key2];}
        return double.call(args);};

      Object.defineProperty(mon, "spy", { value: double });


      desc = Object.getOwnPropertyDescriptor(this.object, name);

      if (desc) throw new Error("Object has defined an own '" + name + "' member. It can't be spied.");else 
      Object.defineProperty(this.object, name, { value: mon });


      this.members[name] = double;} }, { key: 










    getDouble, value: function value(name) {
      var ATTR = 1, METHOD = 2;
      var res, type;


      if (/^@/.test(name)) {
        type = ATTR;
        name = name.substr(1);} else 
      if (/\(\)$/.test(name)) {
        type = METHOD;
        name = name.replace("()", "");}



      res = this.members[name];

      if (!res) {
        throw new Error("'" + name + "' is not being spied.");}


      if (type == ATTR && !(res instanceof _PropertySpy2.default)) {
        throw new Error("The '" + name + "' member is not a property.");} else 
      if (type == METHOD && !(res instanceof _FunctionSpy2.default)) {
        throw new Error("The '" + name + "' member is not a method.");}



      return res;} }, { key: "getCall", value: function getCall(









    name, i) {
      return this[getDouble](name).getCall(i);} }, { key: "getArguments", value: function getArguments(









    name, i) {
      return this[getDouble](name).getArguments(i);} }, { key: "getLastCall", value: function getLastCall(








    name) {
      return this[getDouble](name).getLastCall();} }, { key: "called", value: function called(








    name) {
      return this[getDouble](name).called();} }, { key: "calledWith", value: function calledWith(









    name, args) {
      return this[getDouble](name).calledWith(args);} }, { key: "alwaysCalledWith", value: function alwaysCalledWith(









    name, args) {
      return this[getDouble](name).alwaysCalledWith(args);} }, { key: "returned", value: function returned(














    name, value) {
      return this[getDouble](name).returned(value);} }, { key: "alwaysReturned", value: function alwaysReturned(














    name, value) {
      return this[getDouble](name).alwaysReturned(value);} }, { key: "raised", value: function raised(



















    name, error) {
      return this[getDouble](name).raised(error);} }, { key: "alwaysRaised", value: function alwaysRaised(



















    name, error) {
      return this[getDouble](name).alwaysRaised(error);} }]);return ObjectSpy;}();exports.default = ObjectSpy;
