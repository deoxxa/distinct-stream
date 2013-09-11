var stream = require("readable-stream");

var DistinctStream = module.exports = function DistinctStream(options) {
  options = options || {};

  options.objectMode = true;

  stream.Transform.call(this, options);

  if (options.comparator) {
    this._comparator = options.comparator;
  }

  if (options.logSize) {
    this._logSize = options.logSize;
  }

  if (options.recordDuplicates) {
    this._recordDuplicates = !!options.recordDuplicates;
  }

  this._log = options.log || new Array(this._logSize);
  this._count = 0;
};
DistinctStream.prototype = Object.create(stream.Transform.prototype, {constructor: {value: DistinctStream}});

DistinctStream.prototype._comparator = function compare(a, b) {
  return a === b;
};

DistinctStream.prototype._logSize = 100;
DistinctStream.prototype._recordDuplicates = false;

DistinctStream.prototype._transform = function _transform(input, encoding, done) {
  var found = false;

  for (var i=0;i<this._logSize;++i) {
    if (typeof this._log[i] === "undefined") {
      continue;
    }

    if (this._comparator(this._log[i], input)) {
      found = true;
      break;
    }
  }

  if (!found) {
    this.push(input);
  }

  if (!found || this._recordDuplicates) {
    this._log[this._count++ % this._logSize] = input;
  }

  return done();
};
