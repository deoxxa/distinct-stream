var assert = require("chai").assert;

var DistinctStream = require("../");

describe("distinct-stream", function() {
  it("shouldn't output duplicates", function(done) {
    var distinct = new DistinctStream();

    var expected = [1, 2, 3, 4, 5],
        actual = [];

    distinct.on("data", function(e) {
      actual.push(e);
    });

    distinct.on("end", function() {
      assert.deepEqual(expected, actual);

      return done();
    });

    [1, 2, 3, 4, 5, 1, 2, 3, 4, 5].forEach(function(e) {
      distinct.write(e);
    });

    distinct.end();
  });
});
