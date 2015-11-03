//imports
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _FunctionSpy = require("./FunctionSpy");

var _FunctionSpy2 = _interopRequireDefault(_FunctionSpy);

var _PropertySpy = require("./PropertySpy");

var _PropertySpy2 = _interopRequireDefault(_PropertySpy);

/**
 * Spy on an object.
 *
 * @readonly(protected) object:object   The object.
 * @readonly(protected) members:object  The members to spy.
 */

var ObjectSpy = (function () {
  /**
   * Constructor.
   *
   * @param(attr) object
   */

  function ObjectSpy(object) {
    _classCallCheck(this, ObjectSpy);

    Object.defineProperty(this, "object", { value: object });
    Object.defineProperty(this, "members", { value: {} });
  }

  /**
   * Defines a monitor for a member.
   *
   * @param name:string   The member name: method(), method() {} or @pr.
   */

  _createClass(ObjectSpy, [{
    key: "monitor",
    value: function monitor(name) {
      var PROP = /^@/;
      var DUMMY = /\(\) *{}$/;
      var METHOD = /\(\)$/;

      if (PROP.test(name)) this.monitorProperty(name.replace(PROP, ""));else if (DUMMY.test(name)) this.monitorDummyMethod(name.replace(DUMMY, ""));else if (METHOD.test(name)) this.monitorMethod(name.replace(METHOD, ""));else throw new Error("Member name must be 'method()' or '@attr'. Received: " + name + ".");
    }

    /**
     * Defines a property monitor.
     *
     * @private
     * @param name:string The attribute name.
     */
  }, {
    key: "monitorProperty",
    value: function monitorProperty(name) {
      var double;

      //(1) create double
      double = new _PropertySpy2["default"](this.object, name);

      //(2) double property
      Object.defineProperty(this.object, name, {
        get: function get() {
          return double.getValue();
        },
        set: function set(value) {
          return double.setValue(value);
        }
      });

      //(3) add spied member
      this.members[name] = double;
    }

    /**
     * Creates a dummy method and monitors it.
     *
     * @private
     * @param name:string The method name.
     */
  }, {
    key: "monitorDummyMethod",
    value: function monitorDummyMethod(name) {
      var double, mon, desc;

      //(1) create double and monitor function
      double = new _FunctionSpy2["default"](function () {});
      mon = function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return double.call(args);
      };
      Object.defineProperty(mon, "spy", { value: double });

      //(2) double method
      desc = Object.getOwnPropertyDescriptor(this.object, name);

      if (!desc) {
        Object.defineProperty(this.object, name, { value: mon });
      } else {
        if (desc.writable) this.object[name] = mon;else throw new Error("Object has defined an own '" + name + "' member as read-only. It can't be spied.");
      }

      //(3) add spied member
      this.members[name] = double;
    }

    /**
     * Defines a method monitor.
     *
     * @private
     * @param name:string The method name.
     */
  }, {
    key: "monitorMethod",
    value: function monitorMethod(name) {
      var double, mon, desc;

      //(1) create double and monitor function
      double = new _FunctionSpy2["default"](this.object[name].bind(this.object));
      mon = function () {
        for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return double.call(args);
      };
      Object.defineProperty(mon, "spy", { value: double });

      //(2) double method
      desc = Object.getOwnPropertyDescriptor(this.object, name);

      if (desc) throw new Error("Object has defined an own '" + name + "' member. It can't be spied.");else Object.defineProperty(this.object, name, { value: mon });

      //(3) add spied member
      this.members[name] = double;
    }

    /**
     * Returns the member spy.
      * @protected
     * @param name:string The member name.
     * @return object
     * @throw Error When the member is not being spied.
     */
  }, {
    key: "getDouble",
    value: function getDouble(name) {
      var ATTR = 1,
          METHOD = 2;
      var res, type;

      //(1) get member type
      if (/^@/.test(name)) {
        type = ATTR;
        name = name.substr(1);
      } else if (/\(\)$/.test(name)) {
        type = METHOD;
        name = name.replace("()", "");
      }

      //(2) get double
      res = this.members[name];

      if (!res) {
        throw new Error("'" + name + "' is not being spied.");
      }

      if (type == ATTR && !(res instanceof _PropertySpy2["default"])) {
        throw new Error("The '" + name + "' member is not a property.");
      } else if (type == METHOD && !(res instanceof _FunctionSpy2["default"])) {
        throw new Error("The '" + name + "' member is not a method.");
      }

      //(2) return
      return res;
    }

    /**
     * Returns the call specified.
     *
     * @param name:string The member name.
     * @param i:number    The position.
     * @return Call
     */
  }, {
    key: "getCall",
    value: function getCall(name, i) {
      return this.getDouble(name).getCall(i);
    }

    /**
     * Returns the last call.
     *
     * @param name:string The member name.
     * @return Call
     */
  }, {
    key: "getLastCall",
    value: function getLastCall(name) {
      return this.getDouble(name).getLastCall();
    }

    /**
     * Returns the number of calls.
     *
     * @param name:string The member name.
     * @return number
     */
  }, {
    key: "called",
    value: function called(name) {
      return this.getDouble(name).called();
    }

    /**
     * Returns the number of calls that received the specified arguments.
     *
     * @param name:string   The member name.
     * @param args:object[] The arguments to check.
     * @return number
     */
  }, {
    key: "calledWith",
    value: function calledWith(name, args) {
      return this.getDouble(name).calledWith(args);
    }

    /**
     * Checks whether all calls were with the passed arguments.
     *
     * @param name:string   The member name.
     * @param args:object[] The arguments passed to check.
     * @return boolean
     */
  }, {
    key: "alwaysCalledWith",
    value: function alwaysCalledWith(name, args) {
      return this.getDouble(name).alwaysCalledWith(args);
    }

    /**
     * Returns the number of calls that returned value.
     *
     * @overload
     * @param name:string   The member name.
     * @return number
     *
     * @overload
     * @param name:string   The member name.
     * @param value:object  The value returned.
     * @return number
     */
  }, {
    key: "returned",
    value: function returned(name, value) {
      return this.getDouble(name).returned(value);
    }

    /**
     * Checks whether all calls returned a value.
     *
     * @overload
     * @param name:string   The member name.
     * @return boolean
      * @overload
     * @param name:string   The member name.
     * @param value:object  The value returned.
     * @return boolean
     */
  }, {
    key: "alwaysReturned",
    value: function alwaysReturned(name, value) {
      return this.getDouble(name).alwaysReturned(value);
    }

    /**
     * Returns the number of calls that raised error.
     *
     * @overload
     * @param name:string   The member name.
     * @return number
     *
     * @overload
     * @param name:string   The member name.
     * @param error:string  The error message.
     * @return number
     *
     * @overload
     * @param name:string   The member name.
     * @param error:object  The error raised.
     * @return number
     */
  }, {
    key: "raised",
    value: function raised(name, error) {
      return this.getDouble(name).raised(error);
    }

    /**
     * Checks whether all calls raised error.
     *
     * @overload
     * @param name:string   The member name.
     * @return boolean
     *
     * @overload
     * @param name:string   The member name.
     * @param error:string  The error message.
     * @return boolean
     *
     * @overload
     * @param name:string   The member name.
     * @param error:object  The error.
     * @return boolean
     */
  }, {
    key: "alwaysRaised",
    value: function alwaysRaised(name, error) {
      return this.getDouble(name).alwaysRaised(error);
    }
  }]);

  return ObjectSpy;
})();

exports["default"] = ObjectSpy;
module.exports = exports["default"];
