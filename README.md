<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Sassify Loader</h1>
  <p>Reads JavaScript imports within `scss` files and converts them to a scss compatible format.</p>
</div>


[![Travis](https://img.shields.io/travis/mediamonks/sassify-loader.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/sassify-loader)
[![npm](https://img.shields.io/npm/v/sassify-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/sassify-loader)
[![npm](https://img.shields.io/npm/dm/sassify-loader.svg?maxAge=2592000)](https://www.npmjs.com/package/sassify-loader)

## Installation

```sh
yarn add sassify-loader
```

```sh
npm i -S sassify-loader
```


## Basic Usage

This loader **must** be used before applying another loader that parses SCSS.
This loader will inline the converted SCSS at the point of the import.


### Config (recommended)

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [{
      test: /\.scss$/,
      use: [
        {
          loader: 'sassify-loader',
        }
      ]
    }]
  }
}
```

### Example

**entry.scss**
```
@import './config.js';
```

**config.js**
```
export const mediaQueries = {
  SMALL: '(min-width: 480px)',
  MEDIUM: '(min-width: 720px)',
  LARGE: '(min-width: 1024px)',
};

export const example = {
  colors: {
    bodyBg: '#fff',
    text: '#333',
    border: '#aaBBcc',
  },
  borderRadius: '15.5px',
  width: '50%',
  hasPadding: true,
  hasMargin: false,
  fonts: ['Arial', 'Helvetica'],
  fontIndex: 1,
  content: null,
};

export default {
  color: 'red',
  marginTop: '10px',
};
```

Output **entry.scss**:
```
$mediaQueries: (
  SMALL: '(min-width: 480px)',
  MEDIUM: '(min-width: 720px)',
  LARGE: '(min-width: 1024px)'
);

$example: (
  colors: (bodyBg: rgb(255, 255, 255), text: rgb(51, 51, 51), border: rgb(170, 187, 204)),
  borderRadius: 15.5px,
  width: 50%,
  hasPadding: true,
  hasMargin: false,
  fonts: ('Arial', 'Helvetica'),
  fontIndex: 1,
  content: null
);

$color: 'red';

$marginTop: 10px;
```


## Documentation

View the [generated documentation](http://mediamonks.github.io/sassify-loader/).


## Building

In order to build sassify-loader, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/mediamonks/sassify-loader.git
```

Change to the sassify-loader directory:
```sh
cd sassify-loader
```

Install dev dependencies:
```sh
yarn
```

Use one of the following main scripts:
```sh
yarn build            # build this project
yarn dev              # run compilers in watch mode, both for babel and typescript
yarn test             # run the unit tests incl coverage
yarn test:dev         # run the unit tests in watch mode
yarn lint             # run eslint and tslint on this project
yarn doc              # generate typedoc documentation
```

When installing this module, it adds a pre-commit hook, that runs lint and prettier commands
before committing, so you can be sure that everything checks out.


## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks
