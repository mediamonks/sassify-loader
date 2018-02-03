import fs from 'fs';
import path from 'path';
import compiler from './compiler.js';

function getFixture(filename) {
  return path.resolve(__dirname, `./fixtures/${filename}`);
}

function getOutput(stats) {
  return stats.toJson().modules[0].source;
}

function getExpected(filename) {
  return "module.exports = " + JSON.stringify(
    fs.readFileSync(path.resolve(__dirname, `./fixtures/${filename}`), 'utf-8')
  );
}

test('Converts single map', async () => {
  const stats = await compiler(getFixture('entry.scss'));
  const output = getOutput(stats);
  const expected = getExpected('simple.scss');

  expect(output).toBe(expected);
});

