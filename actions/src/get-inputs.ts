import * as core from '@actions/core';
import {Inputs} from './interfaces';

export function showInputs(inps: Inputs): void {
  core.info(`\
[INFO] Mode: ${inps.Mode}
[INFO] Language: ${inps.Language}
[INFO] Threshold: ${inps.Threshold}
[INFO] MaxLinks: ${inps.MaxLinks}
[INFO] Repository: ${inps.Repository}
[INFO] CustomTrainingData: ${inps.CustomTrainingData}
[INFO] TrainIssues: ${inps.TrainIssues}
[INFO] Unclickable: ${inps.Unclickable}
`);
}

export function getInputs(): Inputs {
  const inps: Inputs = {
    GithubToken: core.getInput('github_token'),
    Mode: core.getInput('mode'),
    Language: core.getInput('language'),
    Threshold: core.getInput('threshold'),
    MaxLinks: core.getInput('max_links'),
    Repository: core.getInput('repository'),
    CustomTrainingData: core.getInput('custom_training_data'),
    TrainIssues: (core.getInput('train_issues') || 'false').toUpperCase() === 'TRUE',
    Unclickable: (core.getInput('unclickable') || 'false').toUpperCase() === 'TRUE'
  };

  return inps;
}
