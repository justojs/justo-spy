[![Build Status](https://travis-ci.org/justojs/justo-spy.svg?branch=master)](https://travis-ci.org/JustoJS/justo-spy)

Test spy library.

*Proudly made with ♥ in Valencia, Spain, EU.*

Features:

- Allow to create function spies.
- Allow to create object spies.

## Test doubles

A **test double** is an object that represents other, used to perform in unit testings.
There are several types of test doubles:

- **Test dummies**. Test double that responds to calls with no action.
- **Test stubs**. Test double that responds to calls with predefined responses.
- **Test spies**. Test double that monitors the calls to an object.

## Install

```
npm install justo-spy
```

## Test spies

A **test spy** is a test double that monitors the calls to an object.

### spy()

The `spy()` function is used to create the function spies:

```
const spy = require("justo-spy");
```

## Function spies

A **function spy** represents a function that monitors another function.
When the function is called, the spy registers the call info.

### Creating function spies

To create a function spy, we must use the `spy()` function:

```
spy(fn : function) : function
```

Example:

```
var sum = spy(function(x, y) {
  return x + y;
});
```

### API spy

The function returned by the `spy()` function contains a property, `spy`,
which is used to access the spy.

Example:

```
sum.spy.called().must.be.eq(10);
sum.spy.calledWith([1, 2]).must.be.eq(1);
```

#### Call class

Every call is represented as an instance of the `Call` class.

Properties:

- `callNo` (number). The number of call.
- `arguments` (object[]). The arguments passed.
- `value` (object). The value returned.
- `error` (object). The error raised.

Methods:

- `returned() : boolean`. Did it return a value?
- `returned(value : object) : boolean`. Did it return the specified value?
- `raised() : boolean`. Did it throw an error?
- `raised(msg : string) : boolean`. Did it throw an error with the specified message?
- `raised(error : object) : boolean`. Did it throw the specified error?

### Querying the spy

To query the monitoring performed by the spy, we can use the following methods.

#### .spy.getCall()

Returns a specified call:

```
getCall() : Call
getCall(i : number) : Call
```

If no argument is passed, the only one call is returned; if several calls performed,
the method throws an error.

#### .spy.getLastCall()

Returns the last call:

```
getLastCall() : Call
```

#### .spy.called()

Returns the number of calls:

```
called() : number
```

#### .spy.calledWith()

Returns the number of calls that received the specified arguments:

```
calledWith(args : object[]) : number
```

#### .spy.alwaysCalledWith()

Returns whether all calls were done with the passed arguments:

```
alwaysCalledWith(args : object[]) : number
```

#### .spy.returned()

Returns the number of calls that returned value:

```
returned() : number
returned(value : object) : number
```

#### .spy.alwaysReturned()

Checks whether all calls returned a value:

```
alwaysReturned() : boolean
alwaysReturned(value : object) : boolean
```

#### .spy.raised()

Returns the number of calls that raised error:

```
raised() : number
raised(msg : string) : number
raised(msg : RegExp) : number
raised(error : object) : number
```

#### .spy.alwaysRaised()

Checks whether all calls raised error:

```
alwaysRaised() : boolean
alwaysRaised(msg : string) : boolean
alwaysRaised(msg : RegExp) : boolean
alwaysRaised(error : object) : boolean
```

### Dummy function spies

We can define a dummy function spy using the following signature:

```
spy() : function
```

For example:

```
var sum = spy();
sum(1, 2);
sum.spy.called().must.be.eq(1);
```

## Object spies

An **object spy** monitors the calls of a member collection.

### Creating object spies

To create an object spy, we must use the `spy()` function:

```
spy(obj : object) : object
spy(obj : object, member : string) : object
spy(obj : object, members : string[]) : object
```

Where the `obj` parameter is the object to spy and `member` and `members` indicate
the members for spying.

Example:

```
user = spy(new User("user01", "pwd"));
user = spy(new User("user01", "pwd"), "changePassword()");
user = spy(new User("user01", "pwd"), ["changePassword()", "@username"]);
```

### API spy

The object returned by the `spy()` function contains a property, `spy`,
which is used to access the spy.

### Monitoring members

Right now, an object spy can monitor members defined at class-level: methods and
properties; it's not possible attributes.

#### Monitoring methods

To spy a method, we have to use the `monitor()` method:

```
monitor(name : string)
```

Where the `name` parameter must be the method name ended with `()`.

Example:

```
user.spy.monitor("changePassword()");
```

If we need to monitor a method replacing this with a dummy method, we have to
indicate the name as follows:

```
name() {}
```

Example:

```
user.spy.monitor("changePassword() {}")
```

Right now, we can only spy a method if the object hasn't defined an
own member with the same name. However, if the method is defined in the class, we
can do it.

#### Monitoring properties

To spy a property, we must also use the `monitor()` method, but the `name`
parameter must start with `@`.

Example:

```
user.spy.monitor("@username");
```

### Querying the spy

To query the monitoring performed by the spy, we can use the methods presented
above in the function spies. The only thing we must remember is adding the
member name as first parameter.

Here are some examples:

```
user.spy.getCall("username", 0).must.have({callNo: 0, accessor: "get", value: "user01", error: undefined});
user.spy.raised("changePassword", "Password can't be undefined.").must.be.eq(2);
```

To maintain the convention, we can also use the name used during the `monitor()` call:

```
user.spy.getCall("@username", 0).must.have({callNo: 0, accessor: "get", value: "user01", error: undefined});
user.spy.raised("changePassword()", "Password can't be undefined.").must.be.eq(2);
```

### Call objects

The method calls contain the following fields:

- `callNo` (number). The number of call.
- `arguments` (object[]). The arguments passed to the call.
- `value` (object). The value returned.
- `error` (object). The error raised.

Meanwhile, the property calls have the following:

- `callNo` (number). The number of call.
- `accessor` (string). Type of access: `get` or `set`.
- `value` (object). Value returned or set.
- `error` (object). Error raised.

Additionally, both types contain the following methods:

- `returned() : boolean`. Did it return a value?
- `returned(value : object) : boolean`. Did it return the specified value?
- `raised() : boolean`. Did it throw an error?
- `raised(msg : string) : boolean`. Did it throw an error with the specified message?
- `raised(re : RegExp) : boolean`. Idem.
- `raised(error : object) : boolean`. Did it throw the specified error?
