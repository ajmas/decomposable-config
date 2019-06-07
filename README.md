# Decomposable Config

This is NOT designed to work in a browser. It needs file system access.

The idea here is to be allow project configuration to be decmposed
into a folder structure or a single JSON file.

An example of allowed structure is presented in the example folder.

Currently in experimental status. Code needs rework. Just here for
validation with others for now.


General conventions:

  - Top level folder is treated as the root object
  - Any sub files or folders are treated as keys in the parent object
  - A file `myfile.json` and a folder `myfolder/index.json` are
    treated as equivalent
  - If `myfolder/index.json` has a key `mykey` and `myfolder` contains
    a folder called `mykey`, then the latter will squash any entries
    defined for that key.


   
## License

Licensed under the MIT license. For details see the
[LICENSE.md](./LICENSE.md) file
