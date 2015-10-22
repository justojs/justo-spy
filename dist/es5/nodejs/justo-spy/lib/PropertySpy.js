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

var _PropertyCall = require("./PropertyCall");

var _PropertyCall2 = _interopRequireDefault(_PropertyCall);

/**
 * Spy on a property or attribute.
 *
 * @readonly(protected) object:object The object to spy.
 * @readonly(protected) name:string   The property name to spy.
 */

var PropertySpy = (function (_CallableSpy) {
  _inherits(PropertySpy, _CallableSpy);

  /**
   * Constructor.
   *
   * @param(attr) object
   * @param(attr) name
   */

  function PropertySpy(object, name) {
    _classCallCheck(this, PropertySpy);

    _get(Object.getPrototypeOf(PropertySpy.prototype), "constructor", this).call(this);
    Object.defineProperty(this, "object", { value: object });
    Object.defineProperty(this, "name", { value: name });
  }

  /**
   * Gets the value.
   *
   * @internal
   */

  _createClass(PropertySpy, [{
    key: "getValue",
    value: function getValue() {
      var callNo, error, value, desc;

      //(1) get descriptor
      desc = Object.getOwnPropertyDescriptor(this.object.constructor.prototype, this.name);

      //(2) invoke
      try {
        callNo = this.callCount;
        value = desc.get.apply(this.object);
      } catch (e) {
        error = e;
      } finally {
        this.callCount += 1;
      }

      //(3) register
      this.register(new _PropertyCall2["default"](callNo, "get", value, error));

      //(4) return
      if (error) throw error;else return value;
    }

    /**
     * Sets the value.
     *
     * @internal
     * @param value:object  The value to set.
     */
  }, {
    key: "setValue",
    value: function setValue(value) {
      var callNo, error, desc;

      //(1) get descriptor
      desc = Object.getOwnPropertyDescriptor(this.object.constructor.prototype, this.name);

      //(2) invoke
      try {
        callNo = this.callCount;
        desc.set.call(this.object, value);
      } catch (e) {
        error = e;
      } finally {
        this.callCount += 1;
      }

      //(3) register
      this.register(new _PropertyCall2["default"](callNo, "set", value, error));

      //(4) return
      if (error) throw error;else return value;
    }
  }]);

  return PropertySpy;
})(_CallableSpy3["default"]);

exports["default"] = PropertySpy;
module.exports = exports["default"];
