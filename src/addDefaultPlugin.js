module.exports = function (babel) {
  const t = babel.types;

  function transform(path) {
    const expressionName = path.node.callee.name;
    if (expressionName === 'require' && !t.isMemberExpression(path.parent)) {
      path.replaceWith(
        t.memberExpression(
          path.node,
          t.identifier('default')
        )
      )
    }
  }
  
  return {
    visitor: {
      CallExpression: (path, state) => {
        const defaultOpts = { total: false };
        const options = Object.assign({}, defaultOpts, state.opts);
        if (options.total) {
          transform(path);
        } else {
          if (path.key !== 'init' && path.parentPath.parentKey !== 'body' && !state.opts.total) {
            transform(path);
          }
        }
      }
    }
  }
}