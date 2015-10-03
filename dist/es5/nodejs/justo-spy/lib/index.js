/**
 * Creates a double to spy an object.
 *
 * @overload Function spy
 * @param fn:function      The function to spy.
 *
 * @overload Object spy
 * @param obj:object              The object to spy.
 * @param [mems]:string|string[]  The members to spy.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.spy = spy;

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function spy() {
  var res;

  //(1) arguments

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 0) throw new Error("Object to spy expected.");

  //(2) create spy
  if (args[0] instanceof Function) res = createFunctionSpy(args[0]);else res = createObjectSpy.apply(undefined, args);

  //(3) return
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
  mon = new FunctionSpy(fn);

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
  Object.defineProperty(obj, "spy", { value: new ObjectSpy(obj) });

  //(3) monitor members
  for (var i = 0; i < mems.length; ++i) {
    obj.spy.monitor(mems[i]);
  }

  //(4) add
  return obj;
}

//imports
var deepEqual = require("deep-equal");

/**
 * A call.
 *
 * @abstract
 * @readonly callNo:number      The number of call.
 * @readonly value:object       The value returned.
 * @readonly error:object       The error raised.
 */

var Call = (function () {
  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr) value
   * @param(attr) error
   */

  function Call(callNo, value, error) {
    _classCallCheck(this, Call);

    Object.defineProperty(this, "callNo", { value: callNo, enumerable: true });
    Object.defineProperty(this, "value", { value: value, enumerable: true });
    Object.defineProperty(this, "error", { value: error, enumerable: true });
  }

  /**
   * A callable spy.
   *
   * @abstract
   * @attr(protected) callCount:number  The number of calls.
   * @readonly(protected) calls:Calls   The calls.
   */

  /**
   * Checks whether the call returned a value.
   *
   * @overload
   * @noparam
   * @return boolean
   *
   * @overload
   * @param value:object  The value returned.
   * @return boolean
   */

  _createClass(Call, [{
    key: "returned",
    value: function returned(value) {
      var res;

      //(1) check
      if (!this.error) {
        if (value === undefined || value === null) res = true;else res = deepEqual(this.value, value);
      } else {
        res = false;
      }

      //(2) return
      return res;
    }

    /**
     * Checks whether the call raised an error.
     *
     * @overload
     * @noparam
     * @return boolean
     *
     * @overload
     * @param msg:string    The error message.
     * @return boolean
     *
     * @overload
     * @param error:object  The object raised.
     * @return boolean
     */
  }, {
    key: "raised",
    value: function raised(error) {
      var res;

      //(1) check
      if (this.error) {
        if (error) {
          if (error.hasOwnProperty("message")) res = this.error.message == error.message;else res = this.error.message == error;
        } else {
          res = true;
        }
      } else {
        res = false;
      }

      //(2) return
      return res;
    }
  }]);

  return Call;
})();

var CallableSpy = (function () {
  /**
   * Constructor.
   */

  function CallableSpy() {
    _classCallCheck(this, CallableSpy);

    Object.defineProperty(this, "callCount", { value: 0, writable: true });
    Object.defineProperty(this, "calls", { value: new Calls() });
  }

  /**
   * A collection of calls.
   *
   * @readonly(protected) items:Call[]  The calls.
   */

  /**
   * Registers a call.
   *
   * @param call:Call The call to register.
   */

  _createClass(CallableSpy, [{
    key: "register",
    value: function register(call) {
      this.calls.add(call);
    }

    /**
     * @alias Calls.getCalls()
     */
  }, {
    key: "getCall",
    value: function getCall(i) {
      return this.calls.getCall(i);
    }

    /**
     * @alias Calls.getCalls()
     */
  }, {
    key: "getLastCall",
    value: function getLastCall() {
      return this.calls.getLastCall();
    }

    /**
     * @alias Calls.called()
     */
  }, {
    key: "called",
    value: function called() {
      return this.calls.called();
    }

    /**
     * @alias Calls.calledWith()
     */
  }, {
    key: "calledWith",
    value: function calledWith(args) {
      return this.calls.calledWith(args);
    }

    /**
     * @alias Calls.alwaysCalledWith()
     */
  }, {
    key: "alwaysCalledWith",
    value: function alwaysCalledWith(args) {
      return this.calls.alwaysCalledWith(args);
    }

    /**
     * @alias Calls.returned()
     */
  }, {
    key: "returned",
    value: function returned(value) {
      return this.calls.returned(value);
    }

    /**
     * @alias Calls.alwaysReturned()
     */
  }, {
    key: "alwaysReturned",
    value: function alwaysReturned(value) {
      return this.calls.alwaysReturned(value);
    }

    /**
     * @alias Calls.raised()
     */
  }, {
    key: "raised",
    value: function raised(error) {
      return this.calls.raised(error);
    }

    /**
     * @alias Calls.alwaysRaised()
     */
  }, {
    key: "alwaysRaised",
    value: function alwaysRaised(error) {
      return this.calls.alwaysRaised(error);
    }
  }]);

  return CallableSpy;
})();

var Calls = (function () {
  /**
   * Constructor.
   */

  function Calls() {
    _classCallCheck(this, Calls);

    Object.defineProperty(this, "items", { value: [] });
  }

  /**
   * A call of a function or method.
   *
   * @param arguments:object[] The arguments passed to the call.
   */

  /**
   * The number of calls.
   *
   * @type number
   */

  _createClass(Calls, [{
    key: "add",

    /**
     * Adds a new call.
     *
     * @param call:Call The call to add/register.
     */
    value: function add(call) {
      this.items.push(call);
    }

    /**
     * Returns the call specified.
     *
     * @param i:number  The position.
     * @return Call
     */
  }, {
    key: "getCall",
    value: function getCall(i) {
      return this.items[i];
    }

    /**
     * Returns the last call.
     *
     * @return Call
     */
  }, {
    key: "getLastCall",
    value: function getLastCall() {
      return this.items[this.items.length - 1];
    }

    /**
     * Checks the number of calls.
     *
     * @return number
     */
  }, {
    key: "called",
    value: function called() {
      return this.items.length;
    }

    /**
     * Checks the number of calls that received the specified arguments.
     *
     * @param args:object[] The arguments to check.
     * @return number
     */
  }, {
    key: "calledWith",
    value: function calledWith(args) {
      var res = 0;

      //(1) check
      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].calledWith(args)) res += 1;
      }

      //(2) return
      return res;
    }

    /**
     * Checks whether all calls were with the passed arguments.
     *
     * @param args:object[] The arguments passed to check.
     * @return boolean
     */
  }, {
    key: "alwaysCalledWith",
    value: function alwaysCalledWith(args) {
      var res;

      //(1) check
      if (this.called() === 0) res = false;else res = this.called() == this.calledWith(args);

      //(2) return
      return res;
    }

    /**
     * Returns the number of calls that returned value.
     *
     * @overload
     * @noparam
     * @return number
     *
     * @overload
     * @param value:object  The value returned.
     * @return number
     */
  }, {
    key: "returned",
    value: function returned(value) {
      var res = 0;

      //(1) check
      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].returned(value)) res += 1;
      }

      //(2) return
      return res;
    }

    /**
     * Checks whether all calls returned a value.
     *
     * @overload
     * @noparam
     * @return boolean
      * @overload
     * @param value:object  The value returned.
     * @return boolean
     */
  }, {
    key: "alwaysReturned",
    value: function alwaysReturned(value) {
      var res;

      //(1) check
      if (this.called() === 0) res = false;else res = this.called() == this.returned(value);

      //(2) return
      return res;
    }

    /**
     * Returns the number of calls that raised error.
     *
     * @overload
     * @noparam
     * @return number
     *
     * @overload
     * @param error:string  The error message.
     * @return number
     *
     * @overload
     * @param error:object  The error raised.
     * @return number
     */
  }, {
    key: "raised",
    value: function raised(error) {
      var res = 0;

      //(1) check
      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].raised(error)) res += 1;
      }

      //(2) return
      return res;
    }

    /**
     * Checks whether all calls raised error.
     *
     * @overload
     * @noparam
     * @return boolean
     *
     * @overload
     * @param error:string  The error message.
     * @return boolean
     *
     * @overload
     * @param error:object  The error.
     * @return boolean
     */
  }, {
    key: "alwaysRaised",
    value: function alwaysRaised(error) {
      var res;

      //(1) check
      if (this.called() === 0) res = false;else res = this.called() == this.raised(error);

      //(2) return
      return res;
    }
  }, {
    key: "length",
    get: function get() {
      return this.items.length;
    }
  }]);

  return Calls;
})();

var FunctionCall = (function (_Call) {
  _inherits(FunctionCall, _Call);

  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr=arguments) args
   * @param(attr) value
   * @param(attr) error
   */

  function FunctionCall(callNo, args, value, error) {
    _classCallCheck(this, FunctionCall);

    _get(Object.getPrototypeOf(FunctionCall.prototype), "constructor", this).call(this, callNo, value, error);
    Object.defineProperty(this, "arguments", { value: args, enumerable: true });
  }

  /**
   * Spy on a function.
   *
   * @readonly(protected)  fn:function    The function to spy.
   */

  /**
   * Checks whether the call was done with the specified arguments.
   *
   * @param args:object[] The arguments.
   * @return boolean
   */

  _createClass(FunctionCall, [{
    key: "calledWith",
    value: function calledWith(args) {
      return deepEqual(this.arguments, args);
    }
  }]);

  return FunctionCall;
})(Call);

var FunctionSpy = (function (_CallableSpy) {
  _inherits(FunctionSpy, _CallableSpy);

  /**
   * Constructor.
   *
   * @param(attr) fn
   */

  function FunctionSpy(fn) {
    _classCallCheck(this, FunctionSpy);

    _get(Object.getPrototypeOf(FunctionSpy.prototype), "constructor", this).call(this);
    Object.defineProperty(this, "fn", { value: fn });
  }

  /**
   * Spy on an object.
   *
   * @readonly(protected) object:object   The object.
   * @readonly(protected) members:object  The members to spy.
   */

  /**
   * Calls the function.
   *
   * @internal
   * @param args:object[]  The arguments passed to the call.
   */

  _createClass(FunctionSpy, [{
    key: "call",
    value: function call(args) {
      var callNo, error, value;

      //(1) invoke
      try {
        callNo = this.callCount;
        value = this.fn.apply(this.fn, args);
      } catch (e) {
        error = e;
      } finally {
        this.callCount += 1;
      }

      //(2) register
      this.register(new FunctionCall(callNo, args, value, error));

      //(3) return
      if (error) throw error;else return value;
    }
  }]);

  return FunctionSpy;
})(CallableSpy);

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
   * A call on a property.
   *
   * @readonly accessor:string  Accessor type: get or set.
   */

  /**
   * Defines a monitor for a member.
   *
   * @param name:string   The member name. As method, name().
   */

  _createClass(ObjectSpy, [{
    key: "monitor",
    value: function monitor(name) {
      if (/\(\)$/.test(name)) this.monitorMethod(name.replace("()", ""));else if (/^@/.test(name)) this.monitorAttribute(name.substr(1));else throw new Error("Member name must be 'method()' or '@attr'. Received: " + name + ".");
    }

    /**
     * Defines an attribute monitor.
     *
     * @private
     * @param name:string The attribute name.
     */
  }, {
    key: "monitorAttribute",
    value: function monitorAttribute(name) {
      var double;

      //(1) create double
      double = new PropertySpy(this.object, name);

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
     * Defines a method monitor.
     *
     * @private
     * @param name:string The method name.
     */
  }, {
    key: "monitorMethod",
    value: function monitorMethod(name) {
      var double, mon;

      //(1) create double and monitor function
      double = new FunctionSpy(this.object[name].bind(this.object));
      mon = function () {
        for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return double.call(args);
      };
      Object.defineProperty(mon, "spy", { value: double });

      //(2) double method
      Object.defineProperty(this.object, name, { value: mon, enumerable: true });

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

      if (type == ATTR && !(res instanceof PropertySpy)) {
        throw new Error("The '" + name + "' member is not a property.");
      } else if (type == METHOD && !(res instanceof FunctionSpy)) {
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
    value: function getLastCall(name, i) {
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

var PropertyCall = (function (_Call2) {
  _inherits(PropertyCall, _Call2);

  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr) accessor
   * @param(attr) value
   * @param(attr) error
   */

  function PropertyCall(callNo, accessor, value, error) {
    _classCallCheck(this, PropertyCall);

    _get(Object.getPrototypeOf(PropertyCall.prototype), "constructor", this).call(this, callNo, value, error);
    Object.defineProperty(this, "accessor", { value: accessor, enumerable: true });
  }

  /**
   * Spy on a property or attribute.
   *
   * @readonly(protected) object:object The object to spy.
   * @readonly(protected) name:string   The property name to spy.
   */
  return PropertyCall;
})(Call);

var PropertySpy = (function (_CallableSpy2) {
  _inherits(PropertySpy, _CallableSpy2);

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
      this.register(new PropertyCall(callNo, "get", value, error));

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
      this.register(new PropertyCall(callNo, "set", value, error));

      //(4) return
      if (error) throw error;else return value;
    }
  }]);

  return PropertySpy;
})(CallableSpy);
