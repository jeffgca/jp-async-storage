# Async Storage

This is a module for Mozilla's Addon-SDK that simplifies using IndexedDB in Firefox extensions, based on the [localForage library](https://github.com/mozilla/localForage).

## Installation

For now the best thing to do is probably this:

    cd <extension folder>/lib
    wget <url-to-async-storage.js>

In the next few months Add-on SDK extensions will start to be able to support loading modules from a node_modules directory, so at that point you will instead want to do:

    npm install --save jp-async-storage

## Usage

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

