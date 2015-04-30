//imports
const spy = require("../../dist/es5/nodejs/justo-spy").spy;

//suite
describe("spy()", function() {
  function DummyObject() { }
  DummyObject.prototype.m = function() {};
  DummyObject.prototype.m2 = function() {};

  describe("Error handling", function() {
    it("spy()", function() {
      spy.must.raise();
    });
  });

  describe("Function spy", function() {
    function sum(x, y) {
      return x + y;
    }

    it("spy(fn)", function() {
      var double = spy(sum);
      double.spy.must.be.instanceOf("FunctionSpy");
    });
  });

  describe("Object spy", function() {
    var obj;

    beforeEach(function() {
      obj = new DummyObject();
    });

    it("spy(obj)", function() {
      var double = spy(obj);

      double.must.be.same(obj);
      double.spy.must.be.instanceOf("ObjectSpy");
    });

    it("spy(obj, member : string)", function() {
      var double = spy(obj, "m()");

      double.must.be.same(obj);
      double.spy.must.be.instanceOf("ObjectSpy");
      double.must.have("m");
    });

    it("spy(obj, members : string[])", function() {
      var double = spy(obj, ["m()", "m2()"]);

      double.must.be.same(obj);
      double.spy.must.be.instanceOf("ObjectSpy");
      double.must.have(["m", "m2"]);
    });
  });
});
