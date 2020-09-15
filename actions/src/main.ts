import {context} from '@actions/github';
import * as core from '@actions/core';
import * as io from '@actions/io';
// import * as exec from '@actions/exec';
// import * as github from '@actions/github';
import {Inputs, Repository} from './interfaces';
import {showInputs, getInputs} from './get-inputs';
import {fetchIssues} from './fetch-issues';
import path from 'path';
import * as artifact from '@actions/artifact';

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

    const tmpDir = path.join('/tmp', 'actions-suggest-related-links');
    await io.mkdirP(tmpDir);

    core.startGroup('Fetch and save issues and comments');
    const repository: Repository = await fetchIssues(inps, tmpDir);
    core.endGroup();

    core.startGroup('Upload training data as artifact');
    const artifactClient = artifact.create();
    const artifactOptions: artifact.UploadOptions = {
      continueOnError: true
    };
    const uploadResult = await artifactClient.uploadArtifact(
      'training_data',
      [repository.issues.fullPath, repository.comments.fullPath],
      tmpDir,
      artifactOptions
    );
    core.info(`[INFO] ${uploadResult}`);
    core.endGroup();

    core.info('[INFO] Action successfully completed');

    return;
  } catch (e) {
    throw new Error(e.message);
  }
}
