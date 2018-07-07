# ensure2import

transform `require.ensure` to `import()`

## Install

> npm install ensure2import -g

## Usage

Support `glob` match.

> ensure2import ./src/**/routes/*.js

And then *ensure2import* will transform your code:

```js
require.ensure([], function() {
  const App = require('./container/App/index.js').default;
}, 'chunk-name');

// transformation code
import('./container/App/index.js' /* webpackChunkName: chunk-name */).then(mod => mod.default);
```

With `react-router`:

```js
const routes = [{
  path: 'user/info',
  getComponent: function (nextState, callback) {
    require.ensure([], () => {
      callback(null, require('../container/user/info').default);
    }, 'user-info');
  }
}];

// will be
const routes = [{
  path: 'user/info',
  getComponent: function (nextState, callback) {
    import('../container/user/info' /* webpackChunkName: user-info */)
      .then(mad => callback(null, mad.default));
  }
}];
```
