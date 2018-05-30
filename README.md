# ensure2import

transform `require.ensure` to `import()`

## Install

> npm install ensure2import -g

## Usage

> ensure2import src/routes.js

And then *ensure2import* will transform your code:

```js
require.ensure([], function() {
  const App = require('./container/App/index.js').default;
}, 'chunk-name');

// transformation code
import('./container/App/index.js' /* webpackChunkName: chunk-name */).then(mod => mod.default);
```