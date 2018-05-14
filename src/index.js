#!/usr/bin/env node

const fs = require('fs');
const denodeify = require('denodeify');
const findit = require('findit');
const statAsync = denodeify(fs.stat);
const existsAsync = denodeify(fs.exists);
const path = require('path');

const transform = require('./transform');

const argv = require('yargs')
  .usage('Usage: $0 [file_path] [options] Example: rad ./test/**/*.js --verbose')
  .option('verbose', {
    boolean: true,
    default: false,
    description: 'show verbose',
  })
  .option('total', {
    alias: 't',
    boolean: true,
    default: false,
    description: 'transform all require expression',
  })
  .option('splitting', {
    alias: 's',
    boolean: true,
    default: false,
    description: 'transform require.ensure',
  })
  .option('h', {
    alias: 'help',
    description: 'show hep',
  })
  .epilog('for more information, contact mis:koubo')
  .showHelpOnFail(false, 'whoops, something went wrong! run with --help')
  .alias('version', 'v')
  .argv

const files = argv._;
const verbose = argv.verbose;
const total = argv.total;

if (files.length === 0) {
  console.log('need to provide file path, run with -h to see the example');
  process.exit(1);
}

function findJsFiles(dir) {
  return new Promise(function (resolve, reject) {
    var files = [];
    findit(dir).on('file', function (file) {
      // only return files ending in .js
      if (/\.js$/.test(file)) {
        files.push(file);
      }
    }).on('end', function () {
      resolve(files);
    }).on('error', reject);
  });
}

Promise.resolve().then(function () {
  return Promise.all(files.map(function (file) {
    file = path.resolve(file);
    return existsAsync(file).catch(function (exists) {
      if (!exists) {
        throw new Error('file not found: ' + file);
      }
    }).then(function () {
      return statAsync(file);
    }).then(function (stat) {
      if (stat.isDirectory()) {
        return findJsFiles(file);
      }
      return [file];
    });
  }));
}).then((res) => {
  const flatFiles = res.reduce((a, b) => a.concat(b));
  return transform(flatFiles, { verbose, total });
}).then(() => {
  console.log('finish transform');
}, (error) => {
  console.log(error)
  process.exit(1);
})