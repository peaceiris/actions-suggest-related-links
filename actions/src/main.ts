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

    const eventName = context.eventName;

    if (eventName === 'workflow_dispatch' || eventName === 'schedule') {
      // mode train
      core.info(`[INFO] event: ${eventName}, mode: train`);

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
    } else if (eventName === 'issues') {
      // mode predict
      core.info(`[INFO] event: ${eventName}, mode: predict`);
      const eventType = context.payload.action;
      if (eventType === 'opened') {
        core.info(`[INFO] event type: ${eventType}`);
      } else if (eventType === 'edited') {
        core.warning(`[WARN] ${eventType} event type is not supported`);
      } else {
        core.warning(`[WARN] ${eventType} event type is not supported`);
      }
    } else {
      // unsupported event
      core.warning(`[WARN] ${eventName} event is not supported`);
    }

    core.info('[INFO] completed successfully');

    return;
  } catch (e) {
    throw new Error(e.message);
  }
}
