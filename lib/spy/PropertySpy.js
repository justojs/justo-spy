/**
 * Spy on a property or attribute.
 *
 * @readonly(protected) object:object The object to spy.
 * @readonly(protected) name:string   The property name to spy.
 */
class PropertySpy extends CallableSpy {
  /**
   * Constructor.
   *
   * @param(attr) object
   * @param(attr) name
   */
  constructor(object, name) {
    super();
    Object.defineProperty(this, "object", {value: object});
    Object.defineProperty(this, "name", {value: name});
  }

  /**
   * Gets the value.
   *
   * @internal
   */
  getValue() {
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
    if (error) throw error;
    else return value;
  }

  /**
   * Sets the value.
   *
   * @internal
   * @param value:object  The value to set.
   */
  setValue(value) {
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
    if (error) throw error;
    else return value;
  }
}
