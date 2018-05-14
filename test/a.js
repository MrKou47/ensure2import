const a = require('./e');

const c = require.ensure([], () => {
  callback(null, require('./c'));
}, 'friends/detail');

exports.d = {
  d: require('./d.js').default
};

module.exports = {
  b: require('b')
};