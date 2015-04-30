//imports
const assert = require("assert");
const spy = require("../../../dist/es5/nodejs/justo-spy").spy;

//suite
describe("ObjectSpy", function() {
  var user;
  var double;

  function User(name, pwd) {
    this._username = name;
    this.password = pwd;
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
    it("constructor() from spy()", function() {
      double.must.be.same(user);
      double.spy.must.be.instanceOf("ObjectSpy");
    });
  });

  describe("Methods", function() {
    describe("#monitor()", function() {
      it("monitor(method)", function() {
        double.spy.monitor("changePassword()");
        double.spy.members.must.have("changePassword");
        double.changePassword.must.be.instanceOf(Function);
        double.changePassword.spy.must.be.instanceOf("FunctionSpy");
      });
    });

    describe("Call", function() {
      beforeEach(function() {
        double.spy.monitor("changePassword()");
      });

      it("Once", function() {
        double.changePassword("newPwd").must.be.eq("pwd");
        double.spy.getCall("changePassword", 0).must.have({callNo: 0, arguments: ["newPwd"], value: "pwd", error: undefined});
      });

      it("Twice", function() {
        double.changePassword("pwd1").must.be.eq("pwd");
        double.changePassword("pwd2").must.be.eq("pwd1");
        double.spy.getCall("changePassword", 0).must.have({callNo: 0, arguments: ["pwd1"], value: "pwd", error: undefined});
        double.spy.getCall("changePassword", 1).must.have({callNo: 1, arguments: ["pwd2"], value: "pwd1", error: undefined});
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
        it("Never", function() {
          assert.strictEqual(double.spy.getCall("changePassword", 0), undefined);
        });

        it("Once", function() {
          double.changePassword("PWD");
          double.spy.getCall("changePassword", 0).must.have({callNo: 0, arguments: ["PWD"], value: "pwd", error: undefined});
        });

        it("Twice", function() {
          double.changePassword("pwd1");
          double.changePassword("pwd2");
          double.spy.getCall("changePassword", 0).must.have({callNo: 0, arguments: ["pwd1"], value: "pwd", error: undefined});
          double.spy.getCall("changePassword", 1).must.have({callNo: 1, arguments: ["pwd2"], value: "pwd1", error: undefined});
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

        describe("#alwaysRaised(method, msg)", function() {
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
