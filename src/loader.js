const { NodeVM, VMScript } = require('vm2');
const babel = require('babel-core');
const prettier = require("prettier");
const _ = require('lodash');

const intUnitRegExp = /^([0-9]+)(%|cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)$/;
const floatUnitRegExp = /^([0-9\.]+)(%|cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)$/;

function convert (obj, options) {
  options = options || {};

  if (obj == null) {
    return null;
  } else if (_.isString(obj)) {
    if (/^#[0-9a-f]{3}$/i.test(obj)) {
      const r = parseInt(obj[1] + obj[1], 16);
      const g = parseInt(obj[2] + obj[2], 16);
      const b = parseInt(obj[3] + obj[3], 16);

      // return new sass.types.Color(r, g, b);
      return `rgb(${r}, ${g}, ${b} )`;
    } else if (/^#[0-9a-f]{6}$/i.test(obj)) {
      const r = parseInt(obj[1] + obj[2], 16);
      const g = parseInt(obj[3] + obj[4], 16);
      const b = parseInt(obj[5] + obj[6], 16);

      // return new sass.types.Color(r, g, b);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (intUnitRegExp.test(obj)) {
      const match = obj.match(intUnitRegExp);

      // return new sass.types.Number(parseInt(match[1], 10), match[2]);
      return `${parseInt(match[1], 10)}${match[2]}`;
    } else if (floatUnitRegExp.test(obj)) {
      const match = obj.match(floatUnitRegExp);

      // return new sass.types.Number(parseFloat(match[1]), match[2]);
      return `${parseFloat(match[1])}${match[2]}`;
    } else {
      // return new sass.types.String(obj);
      // TODO, better quotation logic:
      // https://www.w3.org/TR/CSS2/fonts.html#font-family-prop
      return options.isKey ? obj : `'${obj}'`;
    }
  } else if (_.isNumber(obj)) {
    // return new sass.types.Number(obj);
    return obj;
  } else if (_.isBoolean(obj)) {
    // return obj ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
    return obj;
  } else if (_.isArray(obj)) {
    // const list = new sass.types.List(obj.length);
    const list = [];

    for (let i = 0; i < obj.length; i++) {
      // list.setValue(i, convert(obj[i]));
      list.push(convert(obj[i]));
    }

    return `(
      ${list.join(',\n')}
    )`;
  } else if (_.isObject(obj) && !_.isFunction(obj) && !_.isDate(obj)) {
    const keys = _.keys(obj);

    // const map = new sass.types.Map(keys.length);
    const map = [];

    _.forEach(keys, function (key, i) {
      map.push(`${convert(key, { isKey: true })}: ${convert(obj[key])}`);
    });

    return `(
      ${map.join(',\n')}
    )`;
  } else {
    throw new Error('js-to-sass-types: invalid object: ' + obj);
  }
}

function evaluateSource(source) {
  source = transformSource(source);
  return runSource(source);
}

function transformSource(source) {
  // Transform source to es5
  return babel.transform(source, {
    ast: false,
    presets: [ 'env' ],
  }).code;
}

function runSource(source) {
  const vm = new NodeVM();
  let vmScript = source;
  let compiledSource = null;

  try {
    vmScript = new VMScript(source);
  } catch (error) {
    console.error('Failed to compile script.');
    throw error;
  }

  try {
    compiledSource = vm.run(vmScript);
  } catch (error) {
    console.error('Failed to execute script.');
    throw error;
  }

  return compiledSource;
}

/**
 * https://github.com/tompascall/js-to-styles-var-loader/blob/master/index.js
 * https://github.com/jgranstrom/sass-extract
 * https://github.com/prettier/prettier/blob/master/commands.md
 *
 * As sass-loader doesn't support @import 'sassify-loader!./path/to/file'; we have to inline
 * the converted SCSS contents at the @import level.
 *
 * @param source
 * @return {string}
 */
function loader(source) {
  // Match SCSS imports that end with js
  const regexp = /^@import ["|'](.*\.js)["|'];$/gim;
  const modules = [];

  let match = regexp.exec(source);

  while (match !== null) {
      modules.push(new Promise((resolve) => {
        this.loadModule(match[1], (error, importedSource) => {
          if(error) {
            throw new Error(error);
          }

          const exports = evaluateSource(importedSource);
          const vars = Object.assign({}, exports, exports.default);
          const converted = Object.keys(vars)
            .filter(v => v !== 'default')
            .map(name =>
              `$${name}: ${convert(vars[name])}`
            ).join(';\n\n');

          const formatted = prettier.format(converted, {
            parser: 'scss',
            printWidth: 100,
            tabWidth: 2,
            singleQuote: true,
            trailingComma: "all",
          });

          // Replace import occurrence with formatted scss
          source = source.replace(regexp, formatted);

          resolve();
        });
      }));
      match = regexp.exec(source);
    }

  return Promise.all(modules).then(() => source);
}

module.exports = loader;

