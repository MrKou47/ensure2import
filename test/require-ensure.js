var a = {
  path: 'path/home',
  getComponent: (nextState, callback) => {
    require.ensure(
      [],
      function() {
        callback(null, require('../home'));
      },
      'home-container'
    );
  },
};

var b = {
  path: 'path/edit',
  getComponent: (nextState, callback) => {
    require.ensure(
      [],
      () => {
        callback(null, require('../edit').default);
      },
      ''
    );
  },
};