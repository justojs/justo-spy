/**
 * Spy on an object.
 *
 * @readonly(protected) object:object   The object.
 * @readonly(protected) members:object  The members to spy.
 */
class ObjectSpy {
  /**
   * Constructor.
   *
   * @param(attr) object
   */
  constructor(object) {
    Object.defineProperty(this, "object", {value: object});
    Object.defineProperty(this, "members", {value: {}});
  }

  /**
   * Defines a monitor for a member.
   *
   * @param name:string   The member name. As method, name().
   */
  monitor(name) {
    if (/\(\)$/.test(name)) this.monitorMethod(name.replace("()", ""));
    else if (/^@/.test(name)) this.monitorAttribute(name.substr(1));
    else throw new Error(`Member name must be 'method()' or '@attr'. Received: ${name}.`);
  }

  /**
   * Defines an attribute monitor.
   *
   * @private
   * @param name:string The attribute name.
   */
  monitorAttribute(name) {
    var double;

    //(1) create double
    double = new PropertySpy(this.object, name);

    //(2) double property
    Object.defineProperty(this.object,
      name,
      {
        get: () => double.getValue(),
        set: (value) => double.setValue(value)
      }
    );

    //(3) add spied member
    this.members[name] = double;
  }

  /**
   * Defines a method monitor.
   *
   * @private
   * @param name:string The method name.
   */
  monitorMethod(name)  {
    var double, mon;

    //(1) create double and monitor function
    double = new FunctionSpy(this.object[name].bind(this.object));
    mon = function(...args) {
      return double.call(args);
    };
    Object.defineProperty(mon, "spy", {value: double});

    //(2) double method
    Object.defineProperty(this.object, name, {value: mon, enumerable: true});

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
  getDouble(name) {
    const ATTR = 1, METHOD = 2;
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
      throw new Error(`'${name}' is not being spied.`);
    }

    if (type == ATTR && !(res instanceof PropertySpy)) {
      throw new Error(`The '${name}' member is not a property.`);
    } else if (type == METHOD && !(res instanceof FunctionSpy)) {
      throw new Error(`The '${name}' member is not a method.`);
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
  getCall(name, i) {
    return this.getDouble(name).getCall(i);
  }

  /**
   * Returns the last call.
   *
   * @param name:string The member name.
   * @return Call
   */
  getLastCall(name, i) {
    return this.getDouble(name).getLastCall();
  }

  /**
   * Returns the number of calls.
   *
   * @param name:string The member name.
   * @return number
   */
  called(name) {
    return this.getDouble(name).called();
  }

  /**
   * Returns the number of calls that received the specified arguments.
   *
   * @param name:string   The member name.
   * @param args:object[] The arguments to check.
   * @return number
   */
  calledWith(name, args) {
    return this.getDouble(name).calledWith(args);
  }

  /**
   * Checks whether all calls were with the passed arguments.
   *
   * @param name:string   The member name.
   * @param args:object[] The arguments passed to check.
   * @return boolean
   */
  alwaysCalledWith(name, args) {
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
  returned(name, value) {
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
  alwaysReturned(name, value) {
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
  raised(name, error) {
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
  alwaysRaised(name, error) {
    return this.getDouble(name).alwaysRaised(error);
  }
}