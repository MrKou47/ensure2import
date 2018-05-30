const { complier } = require('../src/transform');

const path = require('path');

const res = complier(path.join(__dirname, './require-ensure.js'));

console.log(res.code)