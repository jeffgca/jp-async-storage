# Async Storage for Jetpack [![Build Status](https://travis-ci.org/canuckistani/jp-async-storage.png)](https://travis-ci.org/canuckistani/jp-async-storage)

This is a module for Mozilla's Addon-SDK that simplifies using IndexedDB in Firefox extensions, based on the [localForage library](https://github.com/mozilla/localForage).

## Installation

The Add-on SDK supports loading modules from a node_modules directory via the jpm tool, so if you're using jpm all you need to do is this:

    npm install --save jp-async-storage

If you're using cfx instead ( [upgrade! upgrade!](http://work.erikvold.com/jetpack/2014/08/07/cfx-to-jpm.html) ) you can just to this:

    cd <extension folder>/lib
    wget https://raw.githubusercontent.com/canuckistani/jp-async-storage/master/lib/async-storage.js

## Usage
    let { AsyncStorage } = require("async-storage");

    let config = {
      name: 'my-database',
      version: 1
    };
    AsyncStorage.open(config, function(e, r) {
      if (e) throw e;
      let item = {_id: 1, string: "Hello world"};
      AsyncStorage.setItem('key-'+item._id, item, function() {
        if (e) throw e;
        // if you got this far, you probably saved data!
      });
    }):

## Supported API

The localForage api is supported:

* setItem
* getItem
* removeItem
* getItems
* keys
* key
* length
* clear

There are two main differences:

1. Promises are not supported, only callbacks
2. callback arguments are node-style: the first argument is an error, and the second is hopefully your data.

## Tests

First install `jpm` with `npm install jpm -g`, then run `jpm test -b nightly -v` with Firefox Nightly installed.

## TODO

* look into using Promises
* consider using a Promise-based initialization method like localForage does with a bit more magic.
