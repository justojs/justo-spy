//imports
const assert = require("assert");
const spy = require("../../../dist/es5/nodejs/justo-spy");

//suite
describe("FunctionSpy", function() {
  var double;
  const error = new Error("x is undefined.");
  const error2 = new Error("y is undefined.");

  beforeEach(function() {
    double = spy(function(x, y) {
      if (x === undefined) throw error;
      if (y === undefined) throw error2;
      return x + y;
    });
  });

  describe("#constructor()", function() {
    it("constructor() - dummy function spy", function() {
      double = spy();
      double.spy.must.be.instanceOf("FunctionSpy");
      double.spy.fn.must.be.instanceOf(Function);
      double.spy.callCount.must.be.eq(0);
      double.spy.calls.length.must.be.eq(0);
    });

    it("constructor(fn) from spy(fn)", function() {
      function sum(x, y) {
        return x + y;
      }

      double = spy(sum);
      double.spy.must.be.instanceOf("FunctionSpy");
      double.spy.fn.must.be.same(sum);
      double.spy.callCount.must.be.eq(0);
      double.spy.calls.length.must.be.eq(0);
    });
  });

  describe("#toString()", function() {
    function fn(one, two) {}

    it("toString()", function() {
      double = spy(fn);
      double.toString().must.be.eq("function fn(one, two) {}");
    });
  });

  describe("Call", function() {
    describe("Call with return", function() {
      it("Call #1", function() {
        double(1, 2).must.be.eq(3);
        double.spy.called().must.be.eq(1);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [1, 2], value: 3, error: undefined});
      });

      it("Call #2", function() {
        double(1, 2).must.be.eq(3);
        double(2, 1).must.be.eq(3);
        double.spy.called().must.be.eq(2);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [1, 2], value: 3, error: undefined});
        double.spy.getCall(1).must.have({callNo: 1, arguments: [2, 1], value: 3, error: undefined});
      });

      it("Call #3", function() {
        double(1, 1).must.be.eq(2);
        double(1, 2).must.be.eq(3);
        double(1, 3).must.be.eq(4);
        double.spy.called().must.be.eq(3);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [1, 1], value: 2, error: undefined});
        double.spy.getCall(1).must.have({callNo: 1, arguments: [1, 2], value: 3, error: undefined});
        double.spy.getCall(2).must.have({callNo: 2, arguments: [1, 3], value: 4, error: undefined});
      });
    });

    describe("Call with throw", function() {
      it("Call #1", function() {
        try {
          double(undefined, 1);
        } catch (e) {

        }

        double.spy.called().must.be.eq(1);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [undefined, 1], value: undefined, error: error});
      });

      it("Call #2", function() {
        try { double(undefined, 1); } catch (e) {}
        try { double(1, undefined); } catch (e) {}

        double.spy.called().must.be.eq(2);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [undefined, 1], value: undefined, error: error});
        double.spy.getCall(1).must.have({callNo: 1, arguments: [1, undefined], value: undefined, error: error2});
      });
    });

    describe("Call mixed", function() {
      it("Call #1: return, throw, return", function() {
        double(1, 1).must.be.eq(2);
        try { double(1, undefined); } catch (e) {}
        double(1, 3).must.be.eq(4);

        double.spy.called().must.be.eq(3);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [1, 1], value: 2, error: undefined});
        double.spy.getCall(1).must.have({callNo: 1, arguments: [1, undefined], value: undefined, error: error2});
        double.spy.getCall(2).must.have({callNo: 2, arguments: [1, 3], value: 4, error: undefined});
      });

      it("Call #2: throw, return, throw", function() {
        try { double(1, undefined); } catch (e) {}
        double(1, 2).must.be.eq(3);
        try { double(undefined, 3); } catch (e) {}

        double.spy.called().must.be.eq(3);
        double.spy.getCall(0).must.have({callNo: 0, arguments: [1, undefined], value: undefined, error: error2});
        double.spy.getCall(1).must.have({callNo: 1, arguments: [1, 2], value: 3, error: undefined});
        double.spy.getCall(2).must.have({callNo: 2, arguments: [undefined, 3], value: undefined, error: error});
      });
    });

    describe("#getCall()", function() {
      describe("No call performed", function() {
        it("getCall()", function() {
          assert(double.spy.getCall() === undefined);
        });

        it("getCall(0)", function() {
          assert(double.spy.getCall(0) === undefined);
        });

        it("getCall(1)", function() {
          assert(double.spy.getCall(1) === undefined);
        });
      });

      describe("Only one call performed", function() {
        beforeEach(function() {
          double(1, 1);
        });

        it("getCall()", function() {
          double.spy.getCall().must.have({callNo: 0, arguments: [1, 1], value: 2, error: undefined});
        });

        it("getCall(0)", function() {
          double.spy.getCall().must.have({callNo: 0, arguments: [1, 1], value: 2, error: undefined});
        });

        it("getCall(1)", function() {
          assert(double.spy.getCall(1) === undefined);
        });
      });

      describe("Several calls performed", function() {
        beforeEach(function() {
          double(1, 1);
          double(1, 2);
          double(1, 3);
        });

        it("getCall(0)", function() {
          double.spy.getCall(0).must.have({callNo: 0, arguments: [1, 1], value: 2, error: undefined});
        });

        it("getCall(1)", function() {
          double.spy.getCall(1).must.have({callNo: 1, arguments: [1, 2], value: 3, error: undefined});
        });

        it("getCall(ouOfRange)", function() {
          assert(double.spy.getCall(123) === undefined);
        });

        it("getCall()", function() {
          double.spy.getCall.bind(double.spy).must.raise("Several calls performed. Invoked as if only one performed.");
        });
      });
    });

    describe("#getLastCall()", function() {
      it("getLastCall()", function() {
        double(1, 1);
        double(1, 2);
        double(1, 3);

        double.spy.getLastCall().must.have({callNo: 2, arguments: [1, 3], value: 4, error: undefined});
      });

      it("getLastCall() with no call", function() {
        assert(double.spy.getLastCall() === undefined);
      });
    });
  });

  describe("#calledWith()", function() {
    beforeEach(function() {
      double(1, 1);
      double(1, 2);
      double(1, 3);
      double(1, 2);
      double(1, 1);
    });

    it("calledWith() - once - pass", function() {
      double.spy.calledWith([1, 3]).must.be.eq(1);
    });

    it("calledWith() - twice - pass", function() {
      double.spy.calledWith([1, 1]).must.be.eq(2);
    });

    it("calledWith() - none - pass", function() {
      double.spy.calledWith([1, 2, 3]).must.be.eq(0);
    });
  });

  describe("#alwaysCalledWith()", function() {
    describe("true", function() {
      beforeEach(function() {
        double(1, 1);
        double(1, 1);
        double(1, 1);
      });

      it("alwaysCalledWith() - true", function() {
        double.spy.alwaysCalledWith([1, 1]).must.be.eq(true);
      });

      it("alwaysCalledWith() - false", function() {
        double.spy.alwaysCalledWith([2, 2]).must.be.eq(false);
      });
    });

    describe("false", function() {
      beforeEach(function() {
        double(1, 1);
        double(1, 2);
        double(1, 3);
      });

      it("alwaysCalledWith() - false", function() {
        double.spy.alwaysCalledWith([1, 1]).must.be.eq(false);
      });
    });

    describe("no call", function() {
      it("alwaysCalledWith() - false", function() {
        double.spy.alwaysCalledWith([1, 0]).must.be.eq(false);
      });
    });
  });

  describe("#returned()", function() {
    describe("always returned", function() {
      beforeEach(function() {
        double(1, 1);
        double(1, 2);
        double(2, 1);
        double(2, 2);
      });

      it("returned()", function() {
        double.spy.returned().must.be.eq(4);
      });

      it("returned(value) - value returned once", function() {
        double.spy.returned(2).must.be.eq(1);
      });

      it("returned(value) - value returned twice", function() {
        double.spy.returned(3).must.be.eq(2);
      });

      it("returned(value) - value never returned", function() {
        double.spy.returned(0).must.be.eq(0);
      });
    });

    describe("no returned", function() {
      it("returned() - never returned", function() {
        double.spy.returned().must.be.eq(0);
      });

      it("returned(value) - value never returned", function() {
        double.spy.returned(0).must.be.eq(0);
      });
    });

    describe("mixed", function() {
      beforeEach(function() {
        double(1, 1);
        try { double(undefined, 2); } catch (e) {}
        double(1, 3);
        try { double(1, undefined); } catch (e) {}
      });

      it("returned() = 2", function() {
        double.spy.returned().must.be.eq(2);
      });

      it("returned(value) = 1", function() {
        double.spy.returned(2).must.be.eq(1);
      });

      it("returned(value) = 0", function() {
        double.spy.returned(0).must.be.eq(0);
      });
    });
  });

  describe("#alwaysReturned()", function() {
    describe("same value returned", function() {
      beforeEach(function() {
        double(1, 2);
        double(2, 1);
      });

      it("alwaysReturned()", function() {
        double.spy.alwaysReturned().must.be.eq(true);
      });

      it("alwaysRetuned(value) - value always returned", function() {
        double.spy.alwaysReturned(3).must.be.eq(true);
      });

      it("alwaysReturned(value) - value never returned", function() {
        double.spy.alwaysReturned(0).must.be.eq(false);
      });
    });

    describe("several values retuned", function() {
      beforeEach(function() {
        double(1, 1);
        double(1, 2);
      });

      it("alwaysReturned()", function() {
        double.spy.alwaysReturned().must.be.eq(true);
      });

      it("alwaysReturned(value) - false", function() {
        double.spy.alwaysReturned(2).must.be.eq(false);
      });
    });

    describe("no return", function() {
      it("alwaysReturned()", function() {
        double.spy.alwaysReturned().must.be.eq(false);
      });

      it("alwaysReturned(value)", function() {
        double.spy.alwaysReturned(0).must.be.eq(false);
      });
    });

    describe("some value returned", function() {
      beforeEach(function() {
        double(1, 1);
        try { double(undefined, 1); } catch (e) {}
        double(1, 1);
      });

      it("alwaysReturned()", function() {
        double.spy.alwaysReturned().must.be.eq(false);
      });

      it("alwaysReturned(value)", function() {
        double.spy.alwaysReturned(2).must.be.eq(false);
      });
    });
  });

  describe("#raised()", function() {
    describe("only throw", function() {
      beforeEach(function() {
        try { double(1, undefined); } catch (e) {}
        try { double(undefined, 1); } catch (e) {}
      });

      it("raised()", function() {
        double.spy.raised().must.be.eq(2);
      });

      describe("raised(error : object)", function() {
        it("raised(error) = 1", function() {
          double.spy.raised(error).must.be.eq(1);
        });

        it("raised(error) = 1", function() {
          double.spy.raised(error2).must.be.eq(1);
        });

        it("raised(error) = 0", function() {
          double.spy.raised(new Error("Error message")).must.be.eq(0);
        });
      });

      describe("raised(error : string)", function() {
        it("raised(msg) = 1", function() {
          double.spy.raised(error.message).must.be.eq(1);
        });

        it("raised(msg) = 1", function() {
          double.spy.raised(error2.message).must.be.eq(1);
        });

        it("raised(msg) = 0", function() {
          double.spy.raised("Error message").must.be.eq(0);
        });
      });

      describe("raised(msg : RegExp)", function() {
        it("raised(msg) = 1", function() {
          double.spy.raised(/x is/).must.be.eq(1);
        });

        it("raised(msg) = 1", function() {
          double.spy.raised(/y is/).must.be.eq(1);
        });

        it("raised(msg) = 0", function() {
          double.spy.raised(/unknown/).must.be.eq(0);
        });
      });
    });

    describe("no throw", function() {
      it("raised() = 0", function() {
        double.spy.raised().must.be.eq(0);
      });

      it("raised(error) = 0", function() {
        double.spy.raised(error).must.be.eq(0);
      });
    });

    describe("mixed", function() {
      beforeEach(function() {
        double(1, 1);
        try { double(undefined, 2); } catch (e) {}
        double(1, 3);
        try { double(1, undefined); } catch (e) {}
      });

      it("raised() = 2", function() {
        double.spy.raised().must.be.eq(2);
      });

      it("raised(error) = 1", function() {
        double.spy.raised(error).must.be.eq(1);
      });

      it("raised(error) = 0", function() {
        double.spy.raised(new Error("Error message")).must.be.eq(0);
      });
    });
  });

  describe("#alwaysRaised()", function() {
    describe("Same error raised", function() {
      beforeEach(function() {
        try { double(undefined, 1); } catch (e) {}
        try { double(undefined, 2); } catch (e) {}
        try { double(undefined, 3); } catch (e) {}
      });

      it("alwaysRaised()", function() {
        double.spy.alwaysRaised().must.be.eq(true);
      });

      it("alwaysRaised(error) = true", function() {
        double.spy.alwaysRaised(error).must.be.eq(true);
      });

      it("alwaysRaised(error) = false", function() {
        double.spy.alwaysRaised(error2).must.be.eq(false);
      });
    });

    describe("Several error raised", function() {
      beforeEach(function() {
        try { double(1, undefined); } catch (e) {}
        try { double(undefined, 2); } catch (e) {}
        try { double(3, undefined); } catch (e) {}
      });

      it("alwaysRaised()", function() {
        double.spy.alwaysRaised().must.be.eq(true);
      });

      it("alwaysRaised(error) = false", function() {
        double.spy.alwaysRaised(error).must.be.eq(false);
      });
    });

    describe("No error raised", function() {
      it("alwaysRaised() = false", function() {
        double.spy.alwaysRaised().must.be.eq(false);
      });

      it("alwaysRaised(error) =  false", function() {
        double.spy.alwaysRaised(error).must.be.eq(false);
      });
    });

    describe("Mixed", function() {
      beforeEach(function() {
        double(1, 1);
        try { double(undefined, 2); } catch (e) {}
        double(1, 3);
        try { double(1, undefined); } catch (e) {}
      });

      it("alwaysRaised() = false", function() {
        double.spy.alwaysRaised().must.be.eq(false);
      });

      it("alwaysRaised(error) = false", function() {
        double.spy.alwaysRaised(error).must.be.eq(false);
      });

      it("alwaysRaised(error) = false", function() {
        double.spy.alwaysRaised(new Error("Error msg")).must.be.eq(false);
      });
    });
  });
});
