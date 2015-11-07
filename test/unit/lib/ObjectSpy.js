//imports
const assert = require("assert");
const spy = require("../../../dist/es5/nodejs/justo-spy");

//suite
describe("ObjectSpy", function() {
  var user;
  var double;

  function User(name, pwd) {
    this._username = name;
    this.password = pwd;
    Object.defineProperty(this, "roMethod", {value: function() {}});
    Object.defineProperty(this, "rwMethod", {value: function() {}, writable: true});
  }

  User.prototype.changePassword = function(pwd) {
    var old = this.password;

    if (pwd === undefined) throw new Error("Password can't be undefined.");
    else if (pwd === null) throw new Error("Password can't be null.");
    else this.password = pwd;

    return old;
  };

  Object.defineProperty(
    User.prototype,
    "username",
    {
      get: function() { return this._username; },
      set: function(value) { this._username = value; }
    }
  );

  beforeEach(function() {
    user = new User("user01", "pwd");
    double = spy(user);
  });

  describe("#constructor()", function() {
    it("constructor(object) from spy(object)", function() {
      double.must.be.same(user);
      double.spy.must.be.instanceOf("ObjectSpy");
    });
  });

  describe("Methods", function() {
    describe("#monitor()", function() {
      it("monitor('method()'')", function() {
        double.spy.monitor("changePassword()");
        double.spy.members.must.have("changePassword");
        double.changePassword.must.be.instanceOf(Function);
        double.changePassword.spy.must.be.instanceOf("FunctionSpy");
      });

      it("monitor('method() {}') - undefined own method", function() {
        double.spy.monitor("dummy() {}");
        double.spy.members.must.have("dummy");
        double.dummy.must.be.instanceOf(Function);
        double.dummy.spy.must.be.instanceOf("FunctionSpy");
      });

      it("monitor('method()') - defined own member", function() {
        double.spy.monitor.bind(double.spy, "roMethod()").must.raise("Object has defined an own 'roMethod' member. It can't be spied.");
      });

      it("monitor('method() {}') - defined own member as read-only", function() {
        double.spy.monitor.bind(double.spy, "roMethod() {}").must.raise("Object has defined an own 'roMethod' member as read-only. It can't be spied.");
      });

      it("monitor('method() {}') - defined own member as R/W", function() {
        double.spy.monitor("rwMethod() {}");
        double.spy.members.must.have("rwMethod");
        double.rwMethod.must.be.instanceOf(Function);
        double.rwMethod.spy.must.be.instanceOf("FunctionSpy");
      });
    });

    describe("Call", function() {
      describe("Method", function() {
        beforeEach(function() {
          double.spy.monitor("changePassword()");
        });

        it("Once", function() {
          double.changePassword("newPwd").must.be.eq("pwd");
          double.spy.called("changePassword").must.be.eq(1);
          double.spy.getCall("changePassword", 0).must.have({callNo: 0, arguments: ["newPwd"], value: "pwd", error: undefined});
        });

        it("Twice", function() {
          double.changePassword("pwd1").must.be.eq("pwd");
          double.changePassword("pwd2").must.be.eq("pwd1");
          double.spy.called("changePassword").must.be.eq(2);
          double.spy.getCall("changePassword", 0).must.have({callNo: 0, arguments: ["pwd1"], value: "pwd", error: undefined});
          double.spy.getCall("changePassword", 1).must.have({callNo: 1, arguments: ["pwd2"], value: "pwd1", error: undefined});
        });
      });

      describe("Dummy method", function() {
        beforeEach(function() {
          double.spy.monitor("dummy() {}");
        });

        it("Once", function() {
          double.dummy(1, 2);
          double.spy.called("dummy()").must.be.eq(1);
          double.spy.getCall("dummy()", 0).must.have({callNo: 0, arguments: [1, 2], value: undefined, error: undefined});
        });

        it("Twice", function() {
          double.dummy(1, 2);
          double.dummy(2, 1);
          double.spy.called("dummy()").must.be.eq(2);
          double.spy.getCall("dummy()", 0).must.have({callNo: 0, arguments: [1, 2], value: undefined, error: undefined});
          double.spy.getCall("dummy()", 1).must.have({callNo: 1, arguments: [2, 1], value: undefined, error: undefined});
        });
      });
    });

    describe("Query", function() {
      beforeEach(function() {
        double.spy.monitor("changePassword()");
      });

      it("Using method() as name", function() {
        double.changePassword("PWD");
        double.spy.called("changePassword()").must.be.eq(1);
      });

      describe("#getCall()", function() {
        describe("No call performed", function() {
          it("getCall(member)", function() {
            assert(double.spy.getCall("changePassword()") === undefined);
          });

          it("getCall(member, 0)", function() {
            assert(double.spy.getCall("changePassword()", 0) === undefined);
          });

          it("getCall(member, 1)", function() {
            assert(double.spy.getCall("changePassword()", 1) === undefined);
          });
        });

        describe("Only one call performed", function() {
          beforeEach(function() {
            double.changePassword("PWD");
          });

          it("getCall(member)", function() {
            double.spy.getCall("changePassword()").must.be.eq({callNo: 0, arguments: ["PWD"], value: "pwd", error: undefined});
          });

          it("getCall(member, 0)", function() {
            double.spy.getCall("changePassword()", 0).must.be.eq({callNo: 0, arguments: ["PWD"], value: "pwd", error: undefined});
          });

          it("getCall(member, 1)", function() {
            assert(double.spy.getCall("changePassword()", 1) === undefined);
          });
        });

        describe("Several calls performed", function() {
          beforeEach(function() {
            double.changePassword("PWD0");
            double.changePassword("PWD1");
          });

          it("getCall(member)", function() {
            double.spy.getCall.bind(double.spy, "changePassword()").must.raise("Several calls performed. Invoked as if only one performed.");
          });

          it("getCall(member, 0)", function() {
            double.spy.getCall("changePassword()", 0).must.be.eq({callNo: 0, arguments: ["PWD0"], value: "pwd", error: undefined});
          });

          it("getCall(member, 1)", function() {
            double.spy.getCall("changePassword()", 1).must.be.eq({callNo: 1, arguments: ["PWD1"], value: "PWD0", error: undefined});
          });

          it("getCall(member, outofrange)", function() {
            assert(double.spy.getCall("changePassword()", 2)  === undefined);
          });
        });
      });

      describe("#getArguments()", function() {
        it("getArguments(method) - no call performed", function() {
          assert(double.spy.getArguments("changePassword()") === undefined);
        });

        it("getArguments(method) - one call performed", function() {
          double.changePassword("PWD");
          double.spy.getArguments("changePassword()").must.be.eq(["PWD"]);
        });

        it("getArguments(method) - several calls performed", function() {
          double.changePassword("PWD1");
          double.changePassword("PWD2");
          double.spy.getArguments.bind(double.spy, "changePassword()").must.raise("Several calls performed. Invoked as if only one performed.");
        });

        it("getArguments(method, i) - into bounds", function() {
          double.changePassword("PWD1");
          double.changePassword("PWD2");
          double.spy.getArguments("changePassword()", 0).must.be.eq(["PWD1"]);
        });

        it("getArguments(method, i) - out of bounds", function() {
          assert(double.spy.getArguments("changePassword()", 123) === undefined);
        });
      });

      describe("#getLastCall()", function() {
        it("Never", function() {
          assert.strictEqual(double.spy.getLastCall("changePassword"), undefined);
        });

        it("Once", function() {
          double.changePassword("PWD");
          double.spy.getLastCall("changePassword").must.have({callNo: 0, arguments: ["PWD"], value: "pwd", error: undefined});
        });

        it("Twice", function() {
          double.changePassword("pwd1");
          double.changePassword("pwd2");
          double.spy.getLastCall("changePassword").must.have({callNo: 1, arguments: ["pwd2"], value: "pwd1", error: undefined});
        });
      });

      describe("#called()", function() {
        it("Never", function() {
          double.spy.called("changePassword").must.be.eq(0);
        });

        it("Once", function() {
          double.changePassword("newPwd");
          double.spy.called("changePassword").must.be.eq(1);
        });

        it("Twice", function() {
          double.changePassword("pwd1");
          double.changePassword("pwd2");
          double.spy.called("changePassword").must.be.eq(2);
        });
      });

      describe("#calledWith()", function() {
        it("Never", function() {
          double.changePassword("pwd");
          double.spy.calledWith("changePassword", ["PWD"]).must.be.eq(0);
        });

        it("Once", function() {
          double.changePassword("pwd");
          double.changePassword("PWD");
          double.spy.calledWith("changePassword", ["pwd"]).must.be.eq(1);
        });

        it("Twice", function() {
          double.changePassword("pwd");
          double.changePassword("PWD");
          double.changePassword("pwd");
          double.spy.calledWith("changePassword", ["pwd"]).must.be.eq(2);
        });
      });

      describe("#alwaysCalledWith()", function() {
        it("Never", function() {
          double.changePassword("pwd");
          double.spy.alwaysCalledWith("changePassword", ["PWD"]).must.be.eq(false);
        });

        it("Sometimes", function() {
          double.changePassword("pwd");
          double.changePassword("PWD");
          double.spy.alwaysCalledWith("changePassword", ["pwd"]).must.be.eq(false);
        });

        it("Always", function() {
          double.changePassword("pwd");
          double.changePassword("pwd");
          double.spy.alwaysCalledWith("changePassword", ["pwd"]).must.be.eq(true);
        });
      });

      describe("#returned()", function() {
        describe("returned()", function() {
          it("Never", function() {
            double.spy.returned("changePassword").must.be.eq(0);
          });

          it("Once", function() {
            double.changePassword("pwd");
            double.spy.returned("changePassword").must.be.eq(1);
          });

          it("Twice", function() {
            double.changePassword("pwd");
            double.changePassword("PWD");
            double.spy.returned("changePassword").must.be.eq(2);
          });

          it("Mixed", function() {
            double.changePassword("pwd");
            double.changePassword("PWD");
            try { double.changePassword(null); } catch (e) {}
            double.changePassword("PwD");

            double.spy.returned("changePassword").must.be.eq(3);
          });
        });

        describe("returned(value)", function() {
          it("Never", function() {
            double.changePassword("PWD");
            double.spy.returned("changePassword", "PWD").must.be.eq(0);
          });

          it("Once", function() {
            double.changePassword("pwd1");
            double.spy.returned("changePassword", "pwd").must.be.eq(1);
          });

          it("Twice", function() {
            double.changePassword("pwd1");
            double.changePassword("pwd2");
            double.changePassword("pwd");
            double.changePassword("pwd1");
            double.spy.returned("changePassword", "pwd").must.be.eq(2);
          });
        });
      });

      describe("#raised()", function() {
        describe("raised(method)", function() {
          it("Never", function() {
            double.spy.raised("changePassword").must.be.eq(0);
          });

          it("Once", function() {
            try { double.changePassword(); } catch (e) {}
            double.spy.raised("changePassword").must.be.eq(1);
          });

          it("Twice", function() {
            try { double.changePassword(undefined); } catch (e) {}
            try { double.changePassword(null); } catch(e) {}
            double.spy.raised("changePassword").must.be.eq(2);
          });

          it("Mixed", function() {
            try { double.changePassword(undefined); } catch (e) {}
            try { double.changePassword(null); } catch (e) {}
            double.changePassword("newPwd");

            double.spy.raised("changePassword").must.be.eq(2);
          });
        });

        describe("raised(method, msg)", function() {
          it("Never", function() {
            double.spy.raised("changePassword", "Password can't be undefined.").must.be.eq(0);
          });

          it("Once", function() {
            try { double.changePassword(); } catch (e) {}
            double.spy.raised("changePassword", "Password can't be undefined.").must.be.eq(1);
          });

          it("Twice", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(); } catch (e) {}
            double.spy.raised("changePassword", "Password can't be undefined.").must.be.eq(2);
          });

          it("Mixed", function() {
            try { double.changePassword(undefined); } catch (e) {}
            try { double.changePassword(null); } catch (e) {}
            double.changePassword("newPwd");

            double.spy.raised("changePassword", "Password can't be undefined.").must.be.eq(1);
            double.spy.raised("changePassword", "Password can't be null.").must.be.eq(1);
          });
        });

        describe("raised(method, error)", function() {
          it("Never", function() {
            double.spy.raised("changePassword", new Error("Password can't be undefined.")).must.be.eq(0);
          });

          it("Once", function() {
            try { double.changePassword(); } catch (e) {}
            double.spy.raised("changePassword", new Error("Password can't be undefined.")).must.be.eq(1);
          });

          it("Twice", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(); } catch (e) {}

            double.spy.raised("changePassword", new Error("Password can't be undefined.")).must.be.eq(2);
          });

          it("Mixed", function() {
            try { double.changePassword(undefined); } catch (e) {}
            try { double.changePassword(null); } catch (e) {}
            double.changePassword("newPwd");

            double.spy.raised("changePassword", new Error("Password can't be undefined.")).must.be.eq(1);
            double.spy.raised("changePassword", new Error("Password can't be null.")).must.be.eq(1);
          });
        });
      });

      describe("#alwaysRaised()", function() {
        describe("#alwaysRaised(method)", function() {
          it("Never", function() {
            double.spy.alwaysRaised("changePassword").must.be.eq(false);
          });

          it("Sometimes", function() {
            try { double.changePassword(); } catch (e) {}
            double.changePassword("pwd");

            double.spy.alwaysRaised("changePassword").must.be.eq(false);
          });

          it("Always", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(null); } catch (e) {}

            double.spy.alwaysRaised("changePassword").must.be.eq(true);
          });
        });

        describe("#alwaysRaised(method, msg : String)", function() {
          it("Never", function() {
            double.spy.alwaysRaised("changePassword", "Password can't be undefined.").must.be.eq(false);
          });

          it("Sometimes", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(null); } catch (e) {}

            double.spy.alwaysRaised("changePassword", "Password can't be undefined.").must.be.eq(false);
          });

          it("Always", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(); } catch (e) {}

            double.spy.alwaysRaised("changePassword", "Password can't be undefined.").must.be.eq(true);
          });
        });

        describe("#alwaysRaised(method, error)", function() {
          it("Never", function() {
            double.spy.alwaysRaised("changePassword", "Password can't be undefined.").must.be.eq(false);
          });

          it("Sometimes", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(null); } catch (e) {}

            double.spy.alwaysRaised("changePassword", new Error("Password can't be undefined.")).must.be.eq(false);
          });

          it("Always", function() {
            try { double.changePassword(); } catch (e) {}
            try { double.changePassword(); } catch (e) {}

            double.spy.alwaysRaised("changePassword", new Error("Password can't be undefined.")).must.be.eq(true);
          });
        });
      });
    });
  });

  describe("Attributes", function() {
    describe("#monitor()", function() {
      it("monitor(attribute)", function() {
        double.spy.monitor("@username");
        double.spy.members.must.have("username");
      });
    });

    describe("Call", function() {
      describe("get", function() {
        beforeEach(function() {
          double.spy.monitor("@username");
        });

        it("Once", function() {
          double.username.must.be.eq("user01");
          double.spy.getCall("username", 0).must.have({callNo: 0, accessor: "get", value: "user01", error: undefined});
        });

        it("Twice", function() {
          double.username.must.be.eq("user01");
          double._username = "USER01";
          double.username.must.be.eq("USER01");

          double.spy.getCall("username", 0).must.have({callNo: 0, accessor: "get", value: "user01", error: undefined});
          double.spy.getCall("username", 1).must.have({callNo: 1, accessor: "get", value: "USER01", error: undefined});
        });
      });

      describe("set", function() {
        beforeEach(function() {
          double.spy.monitor("@username");
        });

        it("Once", function() {
          double.username = "USER01";
          double.spy.getCall("username", 0).must.have({callNo: 0, accessor: "set", value: "USER01", error: undefined});
        });

        it("Twice", function() {
          double.username = "USER01";
          double.username = "U01";

          double.spy.getCall("username", 0).must.have({callNo: 0, accessor: "set", value: "USER01", error: undefined});
          double.spy.getCall("username", 1).must.have({callNo: 1, accessor: "set", value: "U01", error: undefined});
        });
      });
    });

    describe("Query", function() {
      beforeEach(function() {
        double.spy.monitor("@username");
      });

      it("Using @attribue as name", function() {
        double.username = "PWD";
        double.spy.called("@username").must.be.eq(1);
      });
    });
  });
});
