var fs = require('fs');
var path = require('path');
var assert = require('assert');

var rimraf = require('rimraf');
var webpack = require('webpack');
var part = require.resolve('../index');

describe("webpack-part-loader", () => {
  it("can load part of a JS source file", () => {
    create('abc.js', `
module.exports = require('raw!${part}?token=something!./def')
`);
    create('def.js', `
var not = "this bit";
// something
var include = "this";
["and", "other", "lines"];
// something
var also = "not this either";
`);
    return bundle('abc.js').then(result => {
      assert.deepEqual(result,
        `var include = "this";\n["and", "other", "lines"];`);
    });
  });
  it("can load part of itself", () => {
    create('abc.js', `
// here
["we", "shall", "take", "only", "this", "part"];
// here
module.exports = require('raw!${part}?token=here!' + __filename)
`);
    return bundle('abc.js').then(result => {
      assert.deepEqual(result,
        `["we", "shall", "take", "only", "this", "part"];`);
    });
  });
  it("can indent the part", () => {
    create('abc.js', `
// here
[
  "we",
  "shall",
    "take",
  "this",
];
// here
module.exports = require('raw!${part}?token=here&indent=3!' + __filename)
`);
    return bundle('abc.js').then(result => {
      assert.deepEqual(result, chomp`
   [
     "we",
     "shall",
       "take",
     "this",
   ];`);
    });
  });

  var fixturedir = path.join(__dirname, 'fixture');
  beforeEach(() => {
    rimraf.sync(fixturedir);
    fs.mkdirSync(fixturedir);
  });
  function create(filename, content) {
    fs.writeFileSync(path.join(fixturedir, filename), content);
  }
  function bundle(entry) {
    var config = {
      entry: path.join(fixturedir, entry),
      output: {
        path: fixturedir,
        name: 'bundle.js',
        library: 'bundle',
        libraryTarget: 'commonjs2'
      }
    };
    return new Promise((resolve, reject) => {
      webpack(config, (err) => {
        if (err) return reject(err);
        var bundleFile = path.join(fixturedir, 'bundle.js');
        delete require.cache[bundleFile];
        return resolve(require(bundleFile));
      });
    });

  }
});

function chomp(strings) {
  return strings[0].substring(1);
}
