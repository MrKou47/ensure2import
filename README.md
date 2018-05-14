# RAD - require add default

## Install

> npm install @mtfe/rad -g

## Usage

> rad src/**/server.js --verbose

And then RAD will transform your code:

```js
// original code
module.exports = {
  routes: require('./routes'),
};

// transformation code
module.exports = {
  routes: require('./routes').default, // add default here
};
```

**NOTE: ** RAD just change the code `require(xx)` in an `ObjectExpression`. So `require(xx)` code which executing in the global scope will not be transformed. If you want to transform all `require` expression, you need `--total` option.

```js
// original code
require('a');
require('b');
const a = require('./a.js');
const b = require('./b.js');

module.exports = {
  c: require('./c'),
};

function bb() {
  const d = require('./d.js');
  require('e');
}


// without --total option
require('a');
require('b');
const a = require('./a.js');
const b = require('./b.js');

module.exports = {
  c: require('./c').default,
};

function bb() {
  const d = require('./d.js');
  require('e');
}


// with --total option
require('a').default;
require('b').default;
const a = require('./a.js').default;
const b = require('./b.js').default;

module.exports = {
  c: require('./c').default
};

function bb() {
  const d = require('./d.js').default;
  require('e').default;
}
```
