# Decomposable Config

This package provides a solution to allow a JSON based configuration to
be decomposed into a filesystem structure or a single
file JSON. The idea is that in certain cases it is makes sense to 'explode' the JSON file into something that is visible on the file system.

General conventions:

  - Top level folder is treated as the root object
  - Any sub files or folders are treated as keys in the parent object
  - A file `myfile.json` and a folder `myfolder/index.json` are
    treated as equivalent
  - If `myfolder/index.json` has a key `mykey` and `myfolder` contains
    a folder called `mykey`, then the latter will squash any entries
    defined for that key.

A few notes:

  - This is NOT designed to work in a browser. It needs file system access.
  - This package is targeted at JSON based configuration files for now.

## Installing

To install this as a dependency to your project:

    npm install decomposable-config

or via yarn:
   
    yarn install decomposable-config

## License

Licensed under the MIT license. For details see the
[LICENSE.md](./LICENSE.md) file
