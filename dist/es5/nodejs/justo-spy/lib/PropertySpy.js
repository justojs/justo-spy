"use strict";var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();Object.defineProperty(exports, "__esModule", { value: true });var _CallableSpy2 = require("./CallableSpy");var _CallableSpy3 = _interopRequireDefault(_CallableSpy2);var _PropertyCall = require("./PropertyCall");var _PropertyCall2 = _interopRequireDefault(_PropertyCall);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var 









PropertySpy = function (_CallableSpy) {_inherits(PropertySpy, _CallableSpy);






  function PropertySpy(object, name) {_classCallCheck(this, PropertySpy);var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PropertySpy).call(this));

    Object.defineProperty(_this, "object", { value: object });
    Object.defineProperty(_this, "name", { value: name });return _this;}_createClass(PropertySpy, [{ key: "getValue", value: function getValue() 







    {
      var callNo, error, value, desc;


      desc = Object.getOwnPropertyDescriptor(this.object.constructor.prototype, this.name);


      try {
        callNo = this.callCount;
        value = desc.get.apply(this.object);} 
      catch (e) {
        error = e;} finally 
      {
        this.callCount += 1;}



      this.register(new _PropertyCall2.default(callNo, "get", value, error));


      if (error) throw error;else 
      return value;} }, { key: "setValue", value: function setValue(








    value) {
      var callNo, error, desc;


      desc = Object.getOwnPropertyDescriptor(this.object.constructor.prototype, this.name);


      try {
        callNo = this.callCount;
        desc.set.call(this.object, value);} 
      catch (e) {
        error = e;} finally 
      {
        this.callCount += 1;}



      this.register(new _PropertyCall2.default(callNo, "set", value, error));


      if (error) throw error;else 
      return value;} }]);return PropertySpy;}(_CallableSpy3.default);exports.default = PropertySpy;
