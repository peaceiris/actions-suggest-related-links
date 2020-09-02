// import * as main from '../src/main';
import {Inputs} from '../src/interfaces';
import {showInputs, getInputs} from '../src/get-inputs';
import os from 'os';
import fs from 'fs';
import yaml from 'js-yaml';

beforeEach(() => {
  jest.resetModules();
  process.stdout.write = jest.fn();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = yaml.safeLoad(fs.readFileSync(__dirname + '/../../../action.yml', 'utf8'));
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
    process.env[envVar] = doc.inputs[name]['default'];
  });
});

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = yaml.safeLoad(fs.readFileSync(__dirname + '/../../../action.yml', 'utf8'));
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
    console.debug(`delete ${envVar}\t${process.env[envVar]}`);
    delete process.env[envVar];
  });
});

// Assert that process.stdout.write calls called only with the given arguments.
// cf. https://github.com/actions/toolkit/blob/8b0300129f08728419263b016de8630f1d426d5f/packages/core/__tests__/core.test.ts
function assertWriteCalls(calls: string[]): void {
  expect(process.stdout.write).toHaveBeenCalledTimes(calls.length);

  for (let i = 0; i < calls.length; i++) {
    expect(process.stdout.write).toHaveBeenNthCalledWith(i + 1, calls[i]);
  }
}

function getInputsLog(inps: Inputs): string {
  return `\
[INFO] Language: ${inps.Language}
`;
}

describe('showInputs()', () => {
  // eslint-disable-next-line jest/expect-expect
  test('print all inputs', () => {
    const inps: Inputs = getInputs();
    showInputs(inps);

    const test = getInputsLog(inps);
    assertWriteCalls([`${test}${os.EOL}`]);
  });
});

describe('getInputs()', () => {
  test('get default inputs', () => {
    const inps: Inputs = getInputs();

    expect(inps.GithubToken).toMatch('${{ github.token }}');
    expect(inps.Language).toMatch('en');
  });

  test('get spec inputs', () => {
    process.env['INPUT_GITHUB_TOKEN'] = 'xxx';
    process.env['INPUT_LANGUAGE'] = 'ja';

    const inps: Inputs = getInputs();

    expect(inps.GithubToken).toMatch('xxx');
    expect(inps.Language).toMatch('ja');
  });
});
