#!/usr/bin/env node

var DistinctStream = require("./");

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
