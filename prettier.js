const fs = require('fs');
const path = require('path');
const prettier = require("prettier");

console.log(prettier.format(
  fs.readFileSync(path.resolve(__dirname, 'test/fixtures/simple.scss'), 'utf-8'),
  {
    // parser: 'scss'
    parser: (text, parsers) => {
      const ast = parsers.scss(text, parsers, { parser: 'scss' });
      console.log(JSON.stringify(ast, null, 2));
      return ast;
    }
  }
));
