//imports
const spy = require("justo-spy").spy;

//suite
describe("spy()", function() {
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
    var obj = {};

    it("spy(obj)", function() {
      var double = spy(obj);
      double.must.be.same(obj);
      double.spy.must.be.instanceOf("ObjectSpy");
    });
  });
});
