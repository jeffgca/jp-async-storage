console.log("hello world from test async storage");
let {AsyncStorage} = require('../lib/async-storage');
console.log("required test async storage");
let self = require('sdk/self');
// let async = require('async');

let config = {
  name: 'my-database',
  version: 1
};

require("sdk/preferences/service").set("extensions.sdk.console.logLevel", "all");



// var thrower = function(err){throw err};
var throwerFun = function(assert) {
  return function(err) {
    if (typeof assert == "undefined") {
      throw err;
    } else {
      assert.ok("an error was thrown: ", "an error was thrown: " + err);
    }
  };
}
function open() {
  // make sure we can't call api methods like length without opening first
  try {
    AsyncStorage.length().then(function(length) {
      console.log("this shouldn't reach");
    });
    throw new Error("this shouldn't reach");
  } catch ( err if err instanceof AsyncStorage.UnopenedAsyncDB ) {
    console.log("as expected...");
  }
  AsyncStorage.open(config);
  AsyncStorage.length().then(function(length) {
    console.log("opened...");
  // assert.ok(true, "ok...")
  // done();
  }).catch(throwerFun());
}

open();
/*exports["test callingUnopened"] = function(assert, done){
    var thrower = throwerFun(assert);
    assert.throws(
	function(){
	    AsyncStorage.length().then(function(length){
		console.log( "this shouldn't reach" );
	    });
	},
	AsyncStorage.UnopenedAsyncDB, 
	"shouldn't be able to call api without having opened test");
    done();
};


exports["test open"] = function(assert, done){
    AsyncStorage.open(config);
    AsyncStorage.length().then(function(length){
	assert.ok(true, "ok...")
	done();
    }).catch(throwerFun(assert));
};

*/



exports["test key"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let item = {
    _id: 'does-it-exist',
    string: "Hello?"
  };
  let key = item._id;
  AsyncStorage.setItem(key, item).then(function() {
    AsyncStorage.key(0).then(function(r) {
      console.log("on key then. r is: " + r);
      assert.ok(r, "probably removed item " + item._id);
      AsyncStorage.clear().then(done).catch(thrower);
    }, thrower);
  }).catch(thrower);
}

exports["test key-nonzero"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let promises = [1, 2, 3, 4, 5].map(function(i) {
    return AsyncStorage.setItem("my-key-" + i, "this is my item " + i);
  });

  Promise.all(promises).then(function(results) {
    AsyncStorage.key(2).then(function(key) {
      var expectedKey = 'my-key-3'      var expectedVal = "this is my item 3";
      assert.equal(key, expectedKey, "tested nonzero key");

      AsyncStorage.getItem(key).then(function(val) {

        assert.equal(val, expectedVal, "tested nonzero val");
        AsyncStorage.clear().then(done, thrower);

      }).catch(thrower);
    }).catch(thrower);
  });
}

exports["test setItem"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let item = {
    _id: 1,
    string: "Hello world"
  };
  AsyncStorage.setItem('key-' + item._id, item)
    .then(function(r) {
      // logobj(r, "r in setitem test is");
      // assert.ok((r._id === "key-1"), "right result id.");
      assert.ok((r === "key-1"), "right result id.");
    // assert.ok(r.string === "Hello world", "right result string property.");
    })
    .catch(thrower)
    .then(function() {
      AsyncStorage.clear().then(done)
        .catch(thrower);
    })
    .catch(thrower);
};

exports["test removeItem"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let item = {
    _id: 'to-be-deleted',
    string: "Delete me."
  };
  let key = item._id;
  AsyncStorage.setItem(key, item).then(function() {
    AsyncStorage.removeItem(key).then(function(shouldBeTrue) {
      assert.ok(shouldBeTrue, "probably removed item " + item._id);
      AsyncStorage.clear().then(function() {
        done();
      }).catch(thrower);
    }).catch(thrower);
  }).catch(thrower);
}

exports["test keys"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let promises = [1, 2, 3, 4, 5].map(function(i) {
    return AsyncStorage.setItem("my-key-" + i, "this is my item " + i);
  });

  Promise.all(promises).then(function(results) {
    AsyncStorage.keys().then(function(data) {
      assert.equal(data.length, 5, "we get five keys");
      assert.equal(data[0], 'my-key-1', "the first key is as expected");
      // 
      AsyncStorage.clear().then(done, thrower);
    }).catch(thrower);
  });
}

exports["test getItems"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let promises = [1, 2, 3, 4, 5].map(function(i) {
    return AsyncStorage.setItem("my-key-" + i, "this is my item " + i)
  });

  Promise.all(promises).then(function(results) {
    AsyncStorage.getItems().then(function(data) {
      assert.equal(data.length, 5, "we get five results");
      assert.equal(data[0], "this is my item " + 1, "the first value is as expected");
      assert.equal(data[4], "this is my item " + 5, "the last value is as expected");
      AsyncStorage.clear().then(done, thrower);
    }).catch(thrower);
  }).catch(thrower);
}

exports["test clear"] = function(assert, done) {
  // put something in, retrieve it, then clear, then check there are no keys
  var thrower = throwerFun(assert);
  let promises = [1, 2, 3, 4, 5].map(function(i) {
    return AsyncStorage.setItem("my-key-" + i, "this is my item " + i);
  });

  Promise.all(promises).then(function(result) {
    AsyncStorage.keys().then(function(data) {
      assert.equal(data.length, 5, "we get five keys");
      AsyncStorage.clear().then(function(result) {
        AsyncStorage.keys().then(function(result) {
          assert.equal(result.length, 0, "We shouldn't get keys back");
          done();
        }).catch(thrower);;
      }).catch(thrower);
    }).catch(thrower);;
  }).catch(thrower);;
}

exports["test removeItem"] = function(assert, done) {
  var thrower = throwerFun(assert);
  let k = 'unique-key-456';
  AsyncStorage.setItem(k, [1, 2, 3, 4, 5]).then(function() {
    AsyncStorage.removeItem(k).then(function(r) {
      assert.ok(r, "maybe we removed something");
      AsyncStorage.keys().then(function(r) {
        assert.equal(r.length, 0, "we shouldn't get any keys back.");
        done();
      }).catch(thrower);
    }).catch(thrower);
  }).catch(thrower);
};

exports["test length"] = function(assert, done) {
  var thrower = throwerFun(assert);

  let promises = [1, 2, 3, 4, 5].map(function(i) {
    return AsyncStorage.setItem("my-key-" + i, "this is my item " + i);
  });

  Promise.all(promises).then(function() {
    AsyncStorage.length().then(function(length) {
      assert.equal(length, 5, "Length is five");
      AsyncStorage.clear().then(done).catch(thrower);
    }).catch(thrower);
  }).catch(thrower);
};

// unsuccessful hack to make these tests run first
// var tester = require("sdk/test");
// tester.run(exports["test callingUnopened"]);
// tester.run(exports["test open"]);

// tester.run(exports);

require("sdk/test").run(exports);
// Local Variables:
// compile-cmd: "cd .. && jpm --verbose test -b ~/programs/firefox/firefox-bin "
// End:
