const template = require('babel-template');
const t = require('babel-types');
const { warn } = require('./log');
module.exports = function () {
  function findParentNode(path) {
    return (
      path.node.callee &&
      t.isMemberExpression(path.node.callee) &&
      path.node.callee.object.name === 'require' &&
      path.node.callee.property.name === 'ensure'
    );
  }

  function transform(path, parentPath, filename) {
    const { end } = path.node.loc;
    const requiredFileNode = path.node.arguments[0];
    path.replaceWith(t.identifier('mod'));

    const args = parentPath.node.arguments;
  
    const callbackNode = args[1];
    const webpackChunkNameNode = args[2];

    callbackNode.params.push(
      t.identifier('mod')
    );

    const requiredStr = t.stringLiteral(requiredFileNode.value);

    if (webpackChunkNameNode && webpackChunkNameNode.value) {
      requiredStr.trailingComments = [{
        value: ` webpackChunkName: ${webpackChunkNameNode.value} `
      }];
    } else {
      warn(`${filename} ${end.line}:${end.column} webpackChunkName not found.`);
    }

    const tmpl = template(
      `import(
        IMPORTSOURCE,
      )
      .then(CALLBACK);`,
      { plugins: ['dynamicImport'] });

    const finalAST = tmpl({
      IMPORTSOURCE: requiredStr,
      CALLBACK: callbackNode,
    });

    parentPath.replaceWith(finalAST);
  }
  
  return {
    visitor: {
      CallExpression(path) {
        if (path.node.callee && path.node.callee.name === 'require') {
          const parentPath = path.findParent(findParentNode);
          if (parentPath) {
            const filename = this.file.log.filename;
            transform(path, parentPath, filename);
          }
        }
      },
    }
  }
}