# justo-spy

A test spy library.

*Proudly made in Valencia, Spain, EU.*

Features:

- Allow to create function spies.
- Allow to create object spies.

## Install

`npm install justo-spy`

## spy()

The `spy()` function is used to create the spies.

## Function spy

A **function spy** represents a function that monitors a function.
When it is called, it registers the call info.

### Creating function spies

To create a function spy, we must use the `spy()` function, concretely the
following overload:

```
spy(fn : function) : function
```

Example:

```
var sum = spy(function(x, y) {
  return x + y;
});
```

#### API spy

The function returned by the `spy()` function contains a property, `spy`,
which is used to access the spy.

### Querying the spy

To query the monitoring performed by the spy, we can use the following methods.

But first, an example:

```
sum.spy.called().must.be.eq(10);
sum.spy.calledWith([1, 2]).must.be.eq(1);
```

#### spy.getCall()

Returns a specified call:

```
getCall(i) : Call
```

The spies monitor the calls and save info about each call. The function calls
contain the following fields:

- `callNo` (number). The number of call.
- `arguments` (object[]). The arguments passed to the call.
- `value` (object). The value returned.
- `error` (object). The error raised.

Aditionally, the calls contain the following methods:

- `returned() : boolean`. Did it return a value?
- `returned(value : object) : boolean`. Did it return the specified value?
- `raised() : boolean`. Did it throw an error?
- `raised(msg : string) : boolean`. Did it throw an error with the specified message?
- `raised(error : object) : boolean`. Did it throw the specified error?

#### spy.getLastCall()

Returns the last call:

```
getLastCall() : Call
```

#### spy.called()

Returns the number of calls:

```
called() : number
```

#### spy.calledWith()

Returns the number of calls that received the specified arguments:

```
calledWith(args : object[]) : number
```

#### spy.alwaysCalledWith()

Returns whether all calls were done with the passed arguments:

```
alwaysCalledWith(args : object[]) : number
```

#### spy.returned()

Returns the number of calls that returned value:

```
returned() : number
returned(value : object) : number
```

#### spy.alwaysReturned()

Checks whether all calls returned a value:

```
alwaysReturned() : boolean
alwaysReturned(value) : boolean
```

#### spy.raised()

Returns the number of calls that raised error:

```
raised() : number
raised(msg : string) : number
raised(error : object) : number
```

#### spy.alwaysRaised()

Checks whether all calls raised error:

```
alwaysRaised() : boolean
alwaysRaised(msg : string) : boolean
alwaysRaised(error : object) : boolean
```

## Object spy

An **object spy** monitors the calls of a member collection.


### Creating object spies

To create an object spy, we must use the `spy()` function:

```
spy(obj : object) : object
```

Example:

```
var user = spy(new User("user01", "pwd"));
```

#### API spy

The object  returned by the `spy()` function contains a property, `spy`,
which is used to access the spy.

### Monitoring members

Right now, an object spy can monitor members defined at class-level: methods and
properties; it's not possible attributes.

To set the members to monitor, we have to use the `monitor()` method:

```
monitor(name : string)
```

Where the `name` parameter is the member name: the methods must end with `()` and
the properties must start with `@`. For example:

```
user.spy.monitor("changePassword()"); //method
user.spy.monitor("@status");          //property
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

#### Calls

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

Aditionally, both types contain the following methods:

- `returned() : boolean`. Did it return a value?
- `returned(value : object) : boolean`. Did it return the specified value?
- `raised() : boolean`. Did it throw an error?
- `raised(msg : string) : boolean`. Did it throw an error with the specified message?
- `raised(error : object) : boolean`. Did it throw the specified error?
