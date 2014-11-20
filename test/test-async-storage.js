let { AsyncStorage } = require('../lib/async-storage');
let self = require('sdk/self');
let async = require('async');

let config = {
  name: 'my-database',
  version: 1
};

exports["test open"] = function(assert, done) {
  AsyncStorage.open(config, function(err, result) {
    if (err) throw err;
    assert.ok(result, "We can open the database.");
    done();
  });
};

exports["test setItem"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {
    if (e) throw e;
    if (r) {
      let item = {_id: 1, string: "Hello world"};
      AsyncStorage.setItem('key-'+item._id, item, function() {
        if (e) throw e;
        AsyncStorage.getItem('key-'+item._id, function(e, r) {
          if (e) throw e;
          assert.ok((r._id === 1), "right result id.");
          assert.ok(r.string === "Hello world", "right result string property.");
          AsyncStorage.clear(function(e, r) {
            if (e) throw e;
            done();
          });
        });
      });
    }
  });
};

exports["test removeItem"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {
    let item = {_id: 'to-be-deleted', string: "Delete me."};
    let key = item._id;
    AsyncStorage.setItem(key, item, function() {
      AsyncStorage.removeItem(key, function(e, r) {
        if (e) throw e;
        assert.ok(r, "probably removed item "+item._id);
        AsyncStorage.clear(function(e, r) {
          if (e) throw e;
          done();
        });
      });
    });
  });
};

exports["test keys"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {

    let fns = [1, 2, 3, 4, 5].map(function(i) {
      return function(callback) {
        AsyncStorage.setItem("my-key-"+i, "this is my item "+i, function(e, r) {
          callback(null, true);
        });
      };
    });

    async.series(fns, function(err, result) {
      if (err) throw err;
      AsyncStorage.keys(function(err, data) {
        if (err) throw err;
        assert.ok((data.length === 5), "we get five keys");
        assert.ok((data[0] === 'my-key-1'), "the first key is as expected");

        // 
        AsyncStorage.clear(function(e, r) {
          if (e) throw e;
          done();
        });
      });
    });
  });
};

exports["test getItems"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {

    let fns = [1, 2, 3, 4, 5].map(function(i) {
      return function(callback) {
        AsyncStorage.setItem("my-key-"+i, "this is my item "+i, function(e) {
          if (e) throw e;
          callback(null, true);
        });
      };
    });

    async.series(fns, function(err, result) {
      if (err) throw err;
      AsyncStorage.getItems(function(err, data) {
        if (err) throw err;
        assert.ok((data.length === 5), "we get five results");
        assert.ok((data[0] === "this is my item "+1), "the first value is as expected");
        assert.ok((data[4] === "this is my item "+5), "the last value is as expected");
        AsyncStorage.clear(function(e, r) {
          if (e) throw e;
          done();
        });
      });
    });
  });
};

exports["test clear"] = function(assert, done) {
  // put something in, retrieve it, then clear, then check there are no keys
  AsyncStorage.open(config, function(e, r) {
    let fns = [1, 2, 3, 4, 5].map(function(i) {
      return function(callback) {
        AsyncStorage.setItem("my-key-"+i, "this is my item "+i, function(e, r) {
          if (e) throw e;
          callback(null, true);
        });
      };
    });

    async.series(fns, function(err, result) {
      AsyncStorage.keys(function(err, data) {
        assert.ok((data.length === 5), "we get five keys");
        AsyncStorage.clear(function(err, result) {
          if (err) throw err;
          AsyncStorage.keys(function(err, result) {
            if (err) throw err;
            assert.ok((result.length === 0), "We shouldn't get keys back");
            done();
          });
        });
      });
    });
  });
};

exports["test removeItem"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {
    let k = 'unique-key-456';
    AsyncStorage.setItem(k, [1, 2, 3, 4, 5], function(e) {
      if (e) throw e;
      AsyncStorage.removeItem(k, function(e, r) {
        //
        if (e) throw e;
        assert.ok(r, "maybe we removed something");
        AsyncStorage.keys(function(e, r) {
          if (e) throw e;
          assert.ok((r.length === 0), "we shouldn't get any keys back.");
          done();
        });
      });
    });
  });
};

exports["test length"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {
    let fns = [1, 2, 3, 4, 5].map(function(i) {
      return function(callback) {
        AsyncStorage.setItem("my-key-"+i, "this is my item "+i, function(e, r) {
          if (e) throw e;
          callback(null, true);
        });
      };
    });

    async.series(fns, function(err, result) {
      AsyncStorage.length(function(err, length) {
        assert.ok((length === 5), "Length is five");
        AsyncStorage.clear(function(err, result) {
          if (err) throw err;
          done();
        });
      });
    });
  });
};

exports["test key"] = function(assert, done) {
  AsyncStorage.open(config, function(e, r) {
    let item = {_id: 'does-it-exist', string: "Hello?"};
    let key = item._id;
    AsyncStorage.setItem(key, item, function() {
      AsyncStorage.key(0, function(e, r) {
        if (e) throw e;
        assert.ok(r, "probably removed item "+item._id);
        AsyncStorage.clear(function(e, r) {
          if (e) throw e;
          done();
        });
      });
    });
  });  
};

require("sdk/test").run(exports);
