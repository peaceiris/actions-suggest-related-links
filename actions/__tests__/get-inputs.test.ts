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
  const doc: any = yaml.load(fs.readFileSync(__dirname + '/../../action.yml', 'utf8'));
  Object.keys(doc.inputs).forEach(name => {
    const envVar = `INPUT_${name.replace(/ /g, '_').toUpperCase()}`;
    process.env[envVar] = doc.inputs[name]['default'];
  });
});

afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = yaml.load(fs.readFileSync(__dirname + '/../../action.yml', 'utf8'));
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
[INFO] Mode: ${inps.Mode}
[INFO] Language: ${inps.Language}
[INFO] Threshold: ${inps.Threshold}
[INFO] MaxLinks: ${inps.MaxLinks}
[INFO] Repository: ${inps.Repository}
[INFO] CustomTrainingData: ${inps.CustomTrainingData}
[INFO] TrainIssues: ${inps.TrainIssues}
[INFO] Unclickable: ${inps.Unclickable}
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
    expect(inps.Mode).toMatch('save');
    expect(inps.Language).toMatch('en');
    expect(inps.Threshold).toMatch('0.7');
    expect(inps.MaxLinks).toMatch('3');
    expect(inps.Repository).toMatch('${{ github.repository }}');
    expect(inps.CustomTrainingData).toMatch('');
    expect(inps.TrainIssues).toBeTruthy();
    expect(inps.Unclickable).toBeFalsy();
  });

  test('get spec inputs', () => {
    process.env['INPUT_GITHUB_TOKEN'] = 'xxx';
    process.env['INPUT_MODE'] = 'suggest';
    process.env['INPUT_THRESHOLD'] = '0.8';
    process.env['INPUT_MAX_LINKS'] = '5';
    process.env['INPUT_LANGUAGE'] = 'ja';
    process.env['INPUT_REPOSITORY'] = '${{ github.repository }}';
    process.env['INPUT_CUSTOM_TRAINING_DATA'] = '';
    process.env['INPUT_TRAIN_ISSUES'] = 'true';
    process.env['INPUT_UNCLICKABLE'] = 'true';

    const inps: Inputs = getInputs();

    expect(inps.GithubToken).toMatch('xxx');
    expect(inps.Mode).toMatch('suggest');
    expect(inps.Language).toMatch('ja');
    expect(inps.Threshold).toMatch('0.8');
    expect(inps.MaxLinks).toMatch('5');
    expect(inps.Language).toMatch('ja');
    expect(inps.Repository).toMatch('${{ github.repository }}');
    expect(inps.CustomTrainingData).toMatch('');
    expect(inps.TrainIssues).toBeTruthy();
    expect(inps.Unclickable).toBeTruthy();
  });
});
