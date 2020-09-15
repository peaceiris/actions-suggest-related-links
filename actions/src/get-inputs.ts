import * as core from '@actions/core';
import {Inputs} from './interfaces';

export function showInputs(inps: Inputs): void {
  core.info(`\
[INFO] Language: ${inps.Language}
[INFO] Model: ${inps.Model}
[INFO] Repository: ${inps.Repository}
[INFO] CustomTrainingData: ${inps.CustomTrainingData}
[INFO] TrainIssues: ${inps.TrainIssues}
`);
}

export function getInputs(): Inputs {
  const inps: Inputs = {
    GithubToken: core.getInput('github_token'),
    Language: core.getInput('language'),
    Model: core.getInput('model'),
    Repository: core.getInput('repository'),
    CustomTrainingData: core.getInput('custom_training_data'),
    TrainIssues: (core.getInput('train_issues') || 'false').toUpperCase() === 'TRUE'
  };

  return inps;
}
