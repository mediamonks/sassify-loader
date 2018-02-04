import _ from 'lodash';

const intUnitRegExp = /^([0-9]+)(%|cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)$/;
const floatUnitRegExp = /^([0-9\.]+)(%|cm|em|ex|in|mm|pc|pt|px|vh|vw|vmin)$/;

type ConvertOptions = {
  isKey?: boolean;
};

export default function convert(obj, options: ConvertOptions = {}) {
  if (obj == null) {
    return null;
  }

  if (_.isString(obj)) {
    if (/^#[0-9a-f]{3}$/i.test(obj)) {
      const r = parseInt(obj[1] + obj[1], 16);
      const g = parseInt(obj[2] + obj[2], 16);
      const b = parseInt(obj[3] + obj[3], 16);

      // return new sass.types.Color(r, g, b);
      return `rgb(${r}, ${g}, ${b} )`;
    }

    if (/^#[0-9a-f]{6}$/i.test(obj)) {
      const r = parseInt(obj[1] + obj[2], 16);
      const g = parseInt(obj[3] + obj[4], 16);
      const b = parseInt(obj[5] + obj[6], 16);

      // return new sass.types.Color(r, g, b);
      return `rgb(${r}, ${g}, ${b})`;
    }

    if (intUnitRegExp.test(obj)) {
      const match = obj.match(intUnitRegExp);

      // return new sass.types.Number(parseInt(match[1], 10), match[2]);
      return `${parseInt(match[1], 10)}${match[2]}`;
    }

    if (floatUnitRegExp.test(obj)) {
      const match = obj.match(floatUnitRegExp);

      // return new sass.types.Number(parseFloat(match[1]), match[2]);
      return `${parseFloat(match[1])}${match[2]}`;
    }

    // return new sass.types.String(obj);
    // TODO, better quotation logic:
    // https://www.w3.org/TR/CSS2/fonts.html#font-family-prop
    return options.isKey ? obj : `'${obj}'`;
  }

  if (_.isNumber(obj)) {
    // return new sass.types.Number(obj);
    return obj;
  }

  if (_.isBoolean(obj)) {
    // return obj ? sass.types.Boolean.TRUE : sass.types.Boolean.FALSE;
    return obj;
  }

  if (_.isArray(obj)) {
    const list = obj.map(item => convert(item));

    return `(
      ${list.join(',\n')}
    )`;
  }

  if (_.isObject(obj) && !_.isFunction(obj) && !_.isDate(obj)) {
    const map = Object.keys(obj).map(
      key => `${convert(key, { isKey: true })}: ${convert(obj[key])}`,
    );

    return `(
      ${map.join(',\n')}
    )`;
  }

  /* istanbul ignore next */
  throw new Error('js-to-sass-types: invalid object: ' + obj);
}
