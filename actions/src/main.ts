import {context} from '@actions/github';
import * as core from '@actions/core';
import * as io from '@actions/io';
// import * as exec from '@actions/exec';
// import * as github from '@actions/github';
import {Inputs, Repository, Issue} from './interfaces';
import {showInputs, getInputs} from './get-inputs';
import {fetchIssues} from './fetch-issues';
import path from 'path';
import fs from 'fs';
import * as artifact from '@actions/artifact';
import 'unified';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const unified = require('unified');
import parse from 'remark-parse';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const toString = require('mdast-util-to-string');

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

      // fetch issues and comments
      core.startGroup('Fetch and save issues and comments');
      const repository: Repository = await fetchIssues(inps, tmpDir);
      core.endGroup();

      // preprocessing
      const trainingData: Array<any> = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      Object.keys(repository.issues.data).forEach(data => {
        const tree = unified()
          .use(parse)
          .parse((data as any).body); // eslint-disable-line @typescript-eslint/no-explicit-any
        const textBody = toString(tree);
        const issue: Issue = {
          html_url: (data as any).html_url, // eslint-disable-line @typescript-eslint/no-explicit-any
          number: (data as any).number, // eslint-disable-line @typescript-eslint/no-explicit-any
          title: (data as any).title, // eslint-disable-line @typescript-eslint/no-explicit-any
          body: textBody
        };
        trainingData.push(issue);
      });
      fs.writeFileSync(path.join(tmpDir, 'training-data.json'), JSON.stringify(trainingData));

      // upload artifacts
      core.startGroup('Upload training data as artifact');
      const artifactClient = artifact.create();
      const artifactOptions: artifact.UploadOptions = {
        continueOnError: true
      };
      const uploadResult = await artifactClient.uploadArtifact(
        'training_data',
        [repository.issues.fullPath, repository.comments.fullPath, 'training-data.json'],
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
