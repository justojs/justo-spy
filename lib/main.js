/**
 * Creates a double to spy an object.
 *
 * @overload Function spy
 * @param fn:function      The function to spy.
 *
 * @overload Object spy
 * @param instance:object  The object to spy.
 */
export function spy(obj) {
  var res;

  //(1) arguments
  if (!obj) throw new Error("Object to spy expected.");

  //(2) create spy
  if (obj instanceof Function) res = createFunctionSpy(obj);
  else res = createObjectSpy(obj);

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

  res = function(...args) {
    return mon.call(args);
  };

  Object.defineProperty(res, "spy", {value: mon});

  //(2) return
  return res;
}

/**
 * Creates a double to spy an object.
 *
 * @param obj:object  The object to spy.
 */
function createObjectSpy(obj) {
  Object.defineProperty(obj, "spy", {value: new ObjectSpy(obj)});
  return obj;
}
