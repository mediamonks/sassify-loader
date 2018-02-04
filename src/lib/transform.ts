import { NodeVM, VMScript } from 'vm2';
import * as babel from '@babel/core';

export function evaluateSource(source) {
  return runSource(transformSource(source));
}

function transformSource(source) {
  // Transform source to es5
  return babel.transform(source, {
    ast: false,
    presets: ['@babel/env'],
  }).code;
}

function runSource(source) {
  const vm = new NodeVM();
  let vmScript = source;
  let compiledSource = null;

  try {
    vmScript = new VMScript(source, '');
  } catch (error) {
    /* istanbul ignore next */
    /* tslint:disable no-console */
    console.error('Failed to compile script.');
    /* istanbul ignore next */
    throw error;
  }

  try {
    compiledSource = vm.run(vmScript);
  } catch (error) {
    /* istanbul ignore next */
    /* tslint:disable no-console */
    console.error('Failed to execute script.');
    /* istanbul ignore next */
    throw error;
  }

  return compiledSource;
}
