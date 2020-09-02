import * as core from '@actions/core';
import {Inputs} from './interfaces';

export function showInputs(inps: Inputs): void {
  core.info(`\
[INFO] Language: ${inps.Language}
`);
}

export function getInputs(): Inputs {
  const inps: Inputs = {
    GithubToken: core.getInput('github_token'),
    Language: core.getInput('language')
  };

  return inps;
}
