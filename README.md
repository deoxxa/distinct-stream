distinct-stream [![build status](https://travis-ci.org/deoxxa/distinct-stream.png)](https://travis-ci.org/deoxxa/fork)
===============

Keep a rolling log of inputs and drop duplicates seen within it.

Overview
--------

distinct-stream lets you filter out duplicate values from a stream by keeping a
rolling log (circular buffer) of input and comparing incoming values to that
input according to a function you can specify.

Super Quickstart
----------------

Code:

```javascript
var DistinctStream = require("distinct-stream");

var distinct = new DistinctStream({
  comparator: function compare(a, b) {
    return a.id === b.id;
  },
});

distinct.on("data", console.log);

distinct.write({id: 5, other: 1});
distinct.write({id: 5, other: 2});
distinct.write({id: 3, other: 3});
distinct.write({id: 1, other: 4});
distinct.write({id: 3, other: 5});

distinct.end();
```

Output:

```
{ id: 5, other: 1 }
{ id: 3, other: 3 }
{ id: 1, other: 4 }
```

Installation
------------

Available via [npm](http://npmjs.org/):

> $ npm install distinct-stream

Or via git:

> $ git clone git://github.com/deoxxa/distinct-stream.git node_modules/distinct-stream

**NOTE:**

Currently this is relying on [my fork of readable-stream](https://github.com/deoxxa/readable-stream/tree/fix-issue-66).
Hopefully my patch gets merged and I can remove the hardcoded github dependency.

API
---

**constructor**

Creates a new distinct-stream.

```javascript
new DistinctStream(options);
```

```javascript
var fork = new DistinctStream({
  logSize: 100,
  recordDuplicates: true,
  comparator: functon compare(a, b) {
    return a === b;
  },
});
```

* _options_ - an object containing, as well as the regular `TransformStream`
  options, the following possible parameters:

_options_

* _logSize_ - the size of the rolling log. An array of this size will be
  allocated at instantiation time, and will not be resized, but instead accessed
  via a counter modulo `logSize` for efficiency. Array resizes are bad, yo.
  Default is `100`.
* _recordDuplicates_ - a boolean that specifies whether to keep duplicates in
  the log. Handy if you're expecting a *lot* of duplicates and you want to know
  about anything that isn't common, even if it's not necessarily distinct.
  Default is `false`.
* _comparator_ - a function that takes two arguments and returns true/false to
  signify whether two objects should be considered equal. Default is a function
  that returns the result of `a === b`.

Example
-------

Also see [example.js](https://github.com/deoxxa/distinct-stream/blob/master/example.js).

```javascript
var DistinctStream = require("distinct-stream");

var distinct = new DistinctStream({
  logSize: 10, // mess with this number!
  recordDuplicates: true, // try changing this to false!
  comparator: function compare(a, b) {
    return a === b;
  },
});

distinct.on("data", console.log);

for (var i=0;i<10;++i) {
  // simulate some very common, similar inputs
  for (var j=0;j<50;++j) {
    distinct.write(0);
    distinct.write(1);
  }

  // simulate an uncommon, but not necessarily distinct input
  distinct.write(10);
}

distinct.end();
```

Output:

```
0
1
10
10
10
10
10
10
10
10
10
10
```

License
-------

3-clause BSD. A copy is included with the source.

Contact
-------

* GitHub ([deoxxa](http://github.com/deoxxa))
* Twitter ([@deoxxa](http://twitter.com/deoxxa))
* Email ([deoxxa@fknsrs.biz](mailto:deoxxa@fknsrs.biz))
