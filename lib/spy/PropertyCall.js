/**
 * A call on a property.
 *
 * @readonly accessor:string  Accessor type: get or set.
 */
class PropertyCall extends Call {
  /**
   * Constructor.
   *
   * @param(attr) callNo
   * @param(attr) accessor
   * @param(attr) value
   * @param(attr) error
   */
  constructor(callNo, accessor, value, error) {
    super(callNo, value, error);
    Object.defineProperty(this, "accessor", {value: accessor, enumerable: true});
  }
}
