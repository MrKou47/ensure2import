const fs = require('fs');
const babel = require('babel-core');
const ensureToImportPlugin = require('./ensureToImport');
const dynamicImportPlugin = require('babel-plugin-syntax-dynamic-import');

const defultOptions = {
  total: false,
  verbose: false,
  splitting: false,
}

const complier = (filePath, options = {}) => {
  const { total = false, splitting = false } = options;
  const result = babel.transformFileSync(filePath, {
    babelrc: false,
    plugins: [
      dynamicImportPlugin,
      [ensureToImportPlugin, { total, splitting }]
    ],
  });
  return result;
}

exports.complier = complier;

exports.transform = function (files, opts) {
  const options = Object.assign({}, defultOptions, opts);
  const { total, verbose, splitting } = options;
  return new Promise((resolve, reject) => {
    try {
      files.forEach(filePath => {
        if (verbose) console.log(`transform ${filePath}`);
        const result = complier(filePath, { total, splitting });
        fs.writeFileSync(filePath, result.code);
      })
      resolve(true);
    } catch (error) {
      reject(error);
    }
  })
};
