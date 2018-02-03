<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200"
      src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
  <h1>Sassify Loader</h1>
  <p>Reads JavaScript imports within `scss` files and converts them to a scss compatible format.</p>
</div>

<h2 align="center">Install</h2>

> :construction: Available when published

<h2 align="center">Usage</h2>

> :construction: In development

### Usage
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







