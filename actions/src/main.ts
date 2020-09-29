import {context} from '@actions/github';
import * as core from '@actions/core';
import * as io from '@actions/io';
import {Inputs, Repository, Issue} from './interfaces';
import {showInputs, getInputs} from './get-inputs';
import {fetchIssues} from './fetch-issues';
import path from 'path';
import fs from 'fs';
import * as artifact from '@actions/artifact';
import {md2text, removeSymbols} from './preprocess';
import {suggest} from './suggest';

export async function run(): Promise<void> {
  try {
    core.info('[INFO] Usage https://github.com/peaceiris/actions-suggest-related-links#readme');

    const inps: Inputs = getInputs();
    core.startGroup('Dump inputs');
    showInputs(inps);
    core.endGroup();

    if (core.isDebug()) {
      core.startGroup('Debug: dump context');
      console.log(context);
      core.endGroup();
    }

    const userHome = `${process.env['HOME']}`;
    const tmpDir = path.join(userHome, 'actions-suggest-related-links-tmp');
    await io.mkdirP(tmpDir);

    const eventName = context.eventName;

    if (eventName === 'workflow_dispatch' || eventName === 'schedule') {
      // save issues
      core.info(`[INFO] event: ${eventName}, mode: train`);

      // fetch issues and comments
      core.startGroup('Fetch and save issues and comments');
      const repository: Repository = await fetchIssues(inps, tmpDir);
      core.endGroup();

      // preprocessing
      const trainingData: Array<any> = []; // eslint-disable-line @typescript-eslint/no-explicit-any
      repository.issues.data.forEach(data => {
        const issue: Issue = {
          html_url: data.html_url,
          number: data.number,
          title: data.title,
          body: removeSymbols(md2text(data.body))
        };
        trainingData.push(issue);
      });
      const trainingDataFullPath = path.join(tmpDir, 'training-data.json');
      fs.writeFileSync(trainingDataFullPath, JSON.stringify(trainingData));

      // upload artifacts
      core.startGroup('Upload training data as artifact');
      const artifactClient = artifact.create();
      const artifactOptions: artifact.UploadOptions = {
        continueOnError: true
      };
      const uploadResult = await artifactClient.uploadArtifact(
        'training_data',
        [repository.issues.fullPath, repository.comments.fullPath, trainingDataFullPath],
        tmpDir,
        artifactOptions
      );
      core.info(`[INFO] ${uploadResult}`);
      core.endGroup();
    } else if (eventName === 'issues') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body = `${(context.payload.issue as any).body}`;

      if (inps.Mode === 'save') {
        // mode: save body
        core.startGroup('Save input.txt');
        const inputBody = (() => {
          if (body === '') {
            return 'context body is empty';
          } else {
            const plainBody = removeSymbols(md2text(body));
            console.log(plainBody);
            return plainBody;
          }
        })();
        core.info(`[INFO] save input.txt`);
        fs.writeFileSync(path.join(tmpDir, 'input.txt'), inputBody);
        core.endGroup();
      } else if (inps.Mode === 'suggest') {
        // mode: suggest
        core.info(`[INFO] event: ${eventName}, mode: suggest`);
        if (body === '') {
          core.info('[INFO] context body is empty, skip suggesting');
          return;
        }
        const eventType = context.payload.action;
        if (eventType === 'opened') {
          core.info(`[INFO] event type: ${eventType}`);
          await suggest(inps, tmpDir);
        } else if (eventType === 'edited') {
          core.warning(`[WARN] ${eventType} event type is not supported`);
        } else {
          core.warning(`[WARN] ${eventType} event type is not supported`);
        }
      } else {
        // unsupported mode
        throw new Error(`${inps.Mode} mode is not supported`);
      }
    }

    core.info('[INFO] completed successfully');

    return;
  } catch (e) {
    throw new Error(e.message);
  }
}
