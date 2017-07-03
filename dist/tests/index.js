'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

require('es6-promise');

// for regenerator

require('regenerator-runtime/runtime');

// only for tests, because async/await tests are very nice

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _chaiFiles = require('chai-files');

var _chaiFiles2 = _interopRequireDefault(_chaiFiles);

var _walkSync = require('walk-sync');

var _walkSync2 = _interopRequireDefault(_walkSync);

var _fixturify = require('fixturify');

var _fixturify2 = _interopRequireDefault(_fixturify);

var _ = require('../');

var _2 = _interopRequireDefault(_);

var _broccoli = require('broccoli');

var _broccoli2 = _interopRequireDefault(_broccoli);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _broccoliMergeTrees = require('broccoli-merge-trees');

var _broccoliMergeTrees2 = _interopRequireDefault(_broccoliMergeTrees);

var expect = _chai2['default'].expect;
var file = _chaiFiles2['default'].file;

_chai2['default'].use(_chaiFiles2['default']);

describe('Staging files smoke tests', function () {
  var input1 = 'tmp/fixture-input-1';
  var input2 = 'tmp/fixture-input-2';
  var node = undefined;
  var pipeline = undefined;

  beforeEach(function () {
    _fsExtra2['default'].mkdirpSync(input1);
    _fsExtra2['default'].mkdirpSync(input2);
    _fixturify2['default'].writeSync(input1, {
      'add.js': 'export const add = num => num++;',
      'index.js': 'import two from "./two"; import { add } from "./add"; const result = add(two); export default result;'
    });

    _fixturify2['default'].writeSync(input2, {
      'minus.js': 'export const minus = num => num--;',
      'two.js': 'import { minus } from "./minus"; const two = minus(3); export default two;'
    });

    node = new _2['default'](new _broccoliMergeTrees2['default']([input1, input2]), {
      rollup: {
        entry: 'index.js',
        dest: 'out.js'
      }
    });
    pipeline = new _broccoli2['default'].Builder(node);
  });

  afterEach(function () {
    _fsExtra2['default'].removeSync(input1);
    _fsExtra2['default'].removeSync(input2);
    return pipeline.cleanup();
  });

  it('handles merged trees and building from staging', function callee$1$0() {
    var _ref, directory;

    return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
      while (1) switch (context$2$0.prev = context$2$0.next) {
        case 0:
          context$2$0.next = 2;
          return regeneratorRuntime.awrap(pipeline.build());

        case 2:
          _ref = context$2$0.sent;
          directory = _ref.directory;

          expect(file(directory + '/out.js')).to.equal('const minus = num => num--;\n\nconst two = minus(3);\n\nconst add = num => num++;\n\nconst result = add(two);\n\nexport default result;\n');

        case 5:
        case 'end':
          return context$2$0.stop();
      }
    }, null, this);
  });
});

describe('BroccoliRollup', function () {
  var input = 'tmp/fixture-input';
  var node = undefined,
      pipeline = undefined;

  describe("basic usage", function () {
    beforeEach(function () {
      _fsExtra2['default'].mkdirpSync(input);
      _fixturify2['default'].writeSync(input, {
        'add.js': 'export default x => x + x;',
        'index.js': 'import add from "./add"; const two = add(1); export default two;'
      });

      node = new _2['default'](input, {
        rollup: {
          entry: 'index.js',
          dest: 'out.js'
        }
      });

      pipeline = new _broccoli2['default'].Builder(node);
    });

    afterEach(function () {
      _fsExtra2['default'].removeSync(input);
      return pipeline.cleanup();
    });

    it('simple', function callee$2$0() {
      var _ref2, directory;

      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            context$3$0.next = 2;
            return regeneratorRuntime.awrap(pipeline.build());

          case 2:
            _ref2 = context$3$0.sent;
            directory = _ref2.directory;

            expect(file(directory + '/out.js')).to.equal('var add = x => x + x;\n\nconst two = add(1);\n\nexport default two;\n');

          case 5:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    describe('rebuild', function () {
      it('simple', function callee$3$0() {
        var _ref3, directory, errorWasThrown;

        return regeneratorRuntime.async(function callee$3$0$(context$4$0) {
          while (1) switch (context$4$0.prev = context$4$0.next) {
            case 0:

              expect(node._lastBundle).to.be['null'];

              context$4$0.next = 3;
              return regeneratorRuntime.awrap(pipeline.build());

            case 3:
              _ref3 = context$4$0.sent;
              directory = _ref3.directory;

              expect(Object.keys(node._lastBundle)).to.not.be.empty;

              _fixturify2['default'].writeSync(input, { 'minus.js': 'export default x => x - x;' });

              expect(file(directory + '/out.js')).to.equal('var add = x => x + x;\n\nconst two = add(1);\n\nexport default two;\n');

              context$4$0.next = 10;
              return regeneratorRuntime.awrap(pipeline.build());

            case 10:

              expect(file(directory + '/out.js')).to.equal('var add = x => x + x;\n\nconst two = add(1);\n\nexport default two;\n');

              _fixturify2['default'].writeSync(input, {
                'index.js': 'import add from "./add"; import minus from "./minus"; export default { a: add(1), b: minus(1) };'
              });

              context$4$0.next = 14;
              return regeneratorRuntime.awrap(pipeline.build());

            case 14:

              expect(file(directory + '/out.js')).to.equal('var add = x => x + x;\n\nvar minus = x => x - x;\n\nvar index = { a: add(1), b: minus(1) };\n\nexport default index;\n');

              _fixturify2['default'].writeSync(input, { 'minus.js': null });

              errorWasThrown = false;
              context$4$0.prev = 17;
              context$4$0.next = 20;
              return regeneratorRuntime.awrap(pipeline.build());

            case 20:
              context$4$0.next = 27;
              break;

            case 22:
              context$4$0.prev = 22;
              context$4$0.t0 = context$4$0['catch'](17);

              errorWasThrown = true;
              expect(context$4$0.t0).to.have.property('message');
              expect(context$4$0.t0.message).to.match(/Could not (resolve|load)/);

            case 27:

              _fixturify2['default'].writeSync(input, {
                'index.js': 'import add from "./add"; export default add(1);'
              });

              context$4$0.next = 30;
              return regeneratorRuntime.awrap(pipeline.build());

            case 30:

              expect(file(directory + '/out.js')).to.equal('var add = x => x + x;\n\nvar index = add(1);\n\nexport default index;\n');

            case 31:
            case 'end':
              return context$4$0.stop();
          }
        }, null, this, [[17, 22]]);
      });

      describe('stability', function () {
        it('is stable on idempotent rebuild', function callee$4$0() {
          var _ref4, directory, beforeStat, afterStat;

          return regeneratorRuntime.async(function callee$4$0$(context$5$0) {
            while (1) switch (context$5$0.prev = context$5$0.next) {
              case 0:
                context$5$0.next = 2;
                return regeneratorRuntime.awrap(pipeline.build());

              case 2:
                _ref4 = context$5$0.sent;
                directory = _ref4.directory;
                beforeStat = _fsExtra2['default'].statSync(directory + '/out.js');
                context$5$0.next = 7;
                return regeneratorRuntime.awrap(new Promise(function (resolve) {
                  return setTimeout(resolve, 1000);
                }));

              case 7:
                context$5$0.next = 9;
                return regeneratorRuntime.awrap(pipeline.build());

              case 9:
                afterStat = _fsExtra2['default'].statSync(directory + '/out.js');

                expect(beforeStat).to.eql(afterStat);

              case 11:
              case 'end':
                return context$5$0.stop();
            }
          }, null, this);
        });
      });
    });
  });

  describe('targets', function () {

    beforeEach(function () {
      _fsExtra2['default'].mkdirpSync(input);
      _fixturify2['default'].writeSync(input, {
        'add.js': 'export default x => x + x;',
        'index.js': 'import add from "./add"; const two = add(1); export default two;'
      });
    });

    afterEach(function () {
      _fsExtra2['default'].removeSync(input);
      return pipeline.cleanup();
    });

    // supports multiple targets
    it('works with one explicit target', function callee$2$0() {
      var node, _ref5, directory;

      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            node = new _2['default'](input, {
              rollup: {
                entry: 'index.js',
                targets: [{
                  format: 'umd',
                  moduleName: 'thing',
                  dest: 'dist/out.umd.js'
                }]
              }
            });

            pipeline = new _broccoli2['default'].Builder(node);

            context$3$0.next = 4;
            return regeneratorRuntime.awrap(pipeline.build());

          case 4:
            _ref5 = context$3$0.sent;
            directory = _ref5.directory;

            expect((0, _walkSync2['default'])(directory + '/dist')).to.eql(['out.umd.js']);

            expect(file(directory + '/dist/out.umd.js')).to.equal('(function (global, factory) {\n\ttypeof exports === \'object\' && typeof module !== \'undefined\' ? module.exports = factory() :\n\ttypeof define === \'function\' && define.amd ? define(factory) :\n\t(global.thing = factory());\n}(this, (function () { \'use strict\';\n\nvar add = x => x + x;\n\nconst two = add(1);\n\nreturn two;\n\n})));\n');

          case 8:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });

    it('works with many targets', function callee$2$0() {
      var node, _ref6, directory;

      return regeneratorRuntime.async(function callee$2$0$(context$3$0) {
        while (1) switch (context$3$0.prev = context$3$0.next) {
          case 0:
            node = new _2['default'](input, {
              rollup: {
                entry: 'index.js',
                targets: [{
                  format: 'umd',
                  moduleName: 'thing',
                  dest: 'dist/out.umd.js'
                }, {
                  format: 'es',
                  sourceMap: true,
                  dest: 'dist/out.js'
                }]
              }
            });

            pipeline = new _broccoli2['default'].Builder(node);

            context$3$0.next = 4;
            return regeneratorRuntime.awrap(pipeline.build());

          case 4:
            _ref6 = context$3$0.sent;
            directory = _ref6.directory;

            expect((0, _walkSync2['default'])(directory + '/dist')).to.eql(['out.js', 'out.js.map', 'out.umd.js']);

            expect(file(directory + '/dist/out.js')).to.equal('var add = x => x + x;\n\nconst two = add(1);\n\nexport default two;\n\n//# sourceMappingURL=out.js.map\n');

            expect(file(directory + '/dist/out.js.map')).to.equal('{"version":3,"file":"out.js","sources":["../add.js","../index.js"],"sourcesContent":["export default x => x + x;","import add from \\"./add\\"; const two = add(1); export default two;"],"names":[],"mappings":"AAAA,UAAe,CAAC,IAAI,CAAC,GAAG,CAAC;;ACAA,MAAM,GAAG,GAAG,GAAG,CAAC,CAAC,CAAC,CAAC,AAAC,;;"}');

            expect(file(directory + '/dist/out.umd.js')).to.equal('(function (global, factory) {\n\ttypeof exports === \'object\' && typeof module !== \'undefined\' ? module.exports = factory() :\n\ttypeof define === \'function\' && define.amd ? define(factory) :\n\t(global.thing = factory());\n}(this, (function () { \'use strict\';\n\nvar add = x => x + x;\n\nconst two = add(1);\n\nreturn two;\n\n})));\n');

          case 10:
          case 'end':
            return context$3$0.stop();
        }
      }, null, this);
    });
  });

  describe('passing nodeModulesPath', function () {
    it('should throw if nodeModulesPath is relative', function () {
      expect(function () {
        new _2['default']('lib', {
          nodeModulesPath: './',
          rollup: {
            entry: 'index.js',
            dest: 'out.js'
          }
        });
      }).to['throw'](/nodeModulesPath must be fully qualified and you passed a relative path/);
    });
  });
});

// some filesystems dont have lower then 1s mtime resolution, so lets
// wait