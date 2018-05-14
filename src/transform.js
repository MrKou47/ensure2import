const fs = require('fs');
const babel = require('babel-core');
const addDefaultPlugin = require('./addDefaultPlugin');

const defultOptions = {
  total: false,
  verbose: false,
  splitting: false,
}

module.exports = function (files, opts) {
  const options = Object.assign({}, defultOptions, opts);
  const { total, verbose, splitting } = options;
  return new Promise((resolve, reject) => {
    try {
      files.forEach(filePath => {
        if (verbose) console.log(`transform ${filePath}`);
        const result = babel.transformFileSync(filePath, {
          babelrc: false,
          plugins: [
            [addDefaultPlugin, { total, splitting }]
          ]
        });
        fs.writeFileSync(filePath, result.code);
      })
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
}


const result = babel.transformFileSync(require('path').join(__dirname, '../server.js'), {
  babelrc: false,
  plugins: [
    [addDefaultPlugin, { total: false }]
  ]
});