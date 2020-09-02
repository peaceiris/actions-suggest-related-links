import {context} from '@actions/github';
import * as core from '@actions/core';
// import * as exec from '@actions/exec';
// import * as github from '@actions/github';
import {Inputs} from './interfaces';
import {showInputs, getInputs} from './get-inputs';

export async function run(): Promise<void> {
  try {
    const inps: Inputs = getInputs();
    core.startGroup('Dump inputs');
    showInputs(inps);
    core.endGroup();

    if (core.isDebug()) {
      core.startGroup('Debug: dump context');
      console.log(context);
      core.endGroup();
    }

    core.info('[INFO] Action successfully completed');

    return;
  } catch (e) {
    throw new Error(e.message);
  }
}
