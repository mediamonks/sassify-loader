import prettier from 'prettier';
import convert from './convert';
import { evaluateSource } from './transform';

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
export default function loader(this: any, source) {
  /* tslint:disable no-this-assignment */
  const loaderContext = this;

  // Match SCSS imports that end with js
  const regexp = /^@import ("|')(.*\.js)\1;$/gim;
  const modules = [];

  let match = regexp.exec(source);

  while (match !== null) {
    modules.push(
      new Promise(resolve => {
        loaderContext.loadModule(match[2], (error, importedSource) => {
          /* istanbul ignore if */
          if (error) {
            throw new Error(error);
          }

          const exports = evaluateSource(importedSource);
          const vars = Object.assign({}, exports, exports.default);
          const converted = Object.keys(vars)
            .filter(v => v !== 'default')
            .map(name => `$${name}: ${convert(vars[name])}`)
            .join(';\n\n');

          const formatted = format(converted);

          // Replace import occurrence with formatted scss
          /* tslint:disable no-parameter-reassignment */
          source = source.replace(regexp, formatted);

          resolve();
        });
      }),
    );
    match = regexp.exec(source);
  }

  return Promise.all(modules).then(() => source);
}

function format(scss) {
  return prettier.format(scss, {
    parser: 'scss',
    printWidth: 100,
    tabWidth: 2,
    singleQuote: true,
    trailingComma: 'all',
  });
}
