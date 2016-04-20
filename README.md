# part-loader for webpack

A webpack loader for extracting a part of a file. Mostly useful when including examples inline in other code.

[![npm version](https://img.shields.io/npm/v/part-loader.svg)](https://www.npmjs.com/package/part-loader) [![Build Status](https://img.shields.io/travis/glenjamin/webpack-part-loader/master.svg)](https://travis-ci.org/glenjamin/webpack-part-loader) ![MIT Licensed](https://img.shields.io/npm/l/part-loader.svg)

## Install

```sh
npm install part-loader
```

## Usage

Generally it makes most sense to use this inline along with the `raw` loader. Prefixing the `require` call with `!!` causes it to skip any other configured loaders.

example1.js
```js
var a = 1;
// snip
var b = 2;
// snip
var c = 3;
```

example2.js
```js
var stuff = require('!!raw!part?token=abc!./example1.js');

stuff === 'var b = 2;'
```

## License

Copyright 2016 Glen Mailer.

MIT Licened.
