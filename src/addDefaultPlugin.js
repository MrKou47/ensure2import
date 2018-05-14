const fs = require('fs');
const p = require('path');
const warn = require('./log').warn;

module.exports = function (babel) {
  const t = babel.types;

  /**
   * parse required name
   * pathname should like: ./filename.js fs ./assets/1-1.png etc. ./filename
   * @param {string} pathname 
   * @param {string} stack filename:line:column
   */
  function parseRequiredName(pathname, errorStackHelper) {
    const returnVal = { parsed: true, pathname };
    const ext = p.extname(pathname).slice(1);
    if (ext !== 'js' && ext !== '') {
      warn(`${pathname} should be a *.js file, rad would not transform this require() expression. ${errorStackHelper}`);
      returnVal.parsed = false;
      return returnVal;
    }
    if (pathname.indexOf('/') === -1) { // may required from node_modules
      warn(`${pathname} maybe required from node_modules and red would not transform this require() expression. ${errorStackHelper}`);
      returnVal.parsed = false;
      return returnVal;
    }
    
    if (ext === '') {
      returnVal.pathname = `${pathname}.js`;
    }
    return returnVal;
  }

  function transform(path, state) {
    const filename = state.file.log.filename;
    const expressionName = path.node.callee.name;
    const loc = path.node.loc;
    const errorStackHelper = `${filename}:${loc.start.line}:${loc.start.column}`;
    if (expressionName === 'require' && !t.isMemberExpression(path.parent)) {
      let requiredFilename = path.node.arguments.length ? path.node.arguments[0].value : '';
      const { parsed, pathname } = parseRequiredName(requiredFilename, errorStackHelper);
      if (!parsed) return;
      const requiredRelativePath = p.resolve(p.dirname(filename), pathname);
      try {
        const commonJSReg = /^(exports|module\.exports)/gm;
        const code = fs.readFileSync(requiredRelativePath, { encoding: 'utf8' });
        if (commonJSReg.test(code)) {
          warn(`${requiredRelativePath} module format used commonJS. rad would not transform this line. ${errorStackHelper}`)
          return;
        }
      } catch (error) {
        console.log(error);
        process.exit(1);
      }
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
          transform(path, state);
        } else {
          if (path.key !== 'init' && path.parentPath.parentKey !== 'body' && !state.opts.total) {
            transform(path, state);
          }
        }
      }
    }
  }
}