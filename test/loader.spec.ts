import {expect} from "chai";
import * as fs from 'fs';
import * as path from 'path';
import compiler from './compiler.js';

function getFixture(filename) {
  return path.resolve(__dirname, `./fixtures/${filename}`);
}

function getOutput(stats) {
  if (stats.toJson().errors.length) {
    console.error(stats.toJson().errors);
  }
  return stats.toJson().modules[0].source;
}

function getExpected(filename) {
  return "module.exports = " + JSON.stringify(
    fs.readFileSync(path.resolve(__dirname, `./fixtures/${filename}`), 'utf-8')
  );
}

describe('sassify-loader', () => {
  it('should match expected CSS output', async () => {
    const stats = await compiler(getFixture('entry.scss'));
    const output = getOutput(stats);
    const expected = getExpected('simple.css');

    expect(output).to.equal(expected);
  });
});
