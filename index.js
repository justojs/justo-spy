//imports
import FunctionSpy from "./lib/FunctionSpy";
import ObjectSpy from "./lib/ObjectSpy";

//api
module.exports = spy;

/**
 * Creates a double to spy an object.
 *
 * @overload Dummy function spy.
 * @noparam
 *
 * @overload Function spy.
 * @param fn:function      The function to spy.
 *
 * @overload Object spy.
 * @param obj:object              The object to spy.
 * @param [mems]:string|string[]  The members to spy.
 */
function spy(...args) {
  var res;

  //(1) create spy
  if (args.length === 0) {
    res = createFunctionSpy(function() {});
  } else {
    if (args[0] instanceof Function) res = createFunctionSpy(args[0]);
    else res = createObjectSpy(...args);
  }

  //(2) return
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
  Object.defineProperty(res, "toString", {value: function() { return fn.toString(); }, enumerable: true});

  //(2) return
  return res;
}

/**
 * Creates a double to spy an object.
 *
 * @param obj:object            The object to spy.
 * @param mems:string|string[]  The members to spy.
 */
function createObjectSpy(obj, mems = []) {
  //(1) arguments
  if (typeof(mems) == "string") mems = [mems];

  //(2) create spy
  Object.defineProperty(obj, "spy", {value: new ObjectSpy(obj)});

  //(3) monitor members
  for (let i = 0; i < mems.length; ++i) {
    obj.spy.monitor(mems[i]);
  }

  //(4) add
  return obj;
}
