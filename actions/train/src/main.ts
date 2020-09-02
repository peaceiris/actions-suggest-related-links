import {context} from '@actions/github';
import * as core from '@actions/core';
import * as io from '@actions/io';
// import * as exec from '@actions/exec';
// import * as github from '@actions/github';
import {Inputs} from './interfaces';
import {showInputs, getInputs} from './get-inputs';
import {GitHubAPI} from './github-api';
import fs from 'fs';
import path from 'path';
import * as artifact from '@actions/artifact';

interface Repository {
  owner: string;
  name: string;
}

interface Issues {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  fileName: string;
  location: string;
  fullPath: string;
}

interface Comments {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  fileName: string;
  location: string;
  fullPath: string;
}

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
    const repoName: Array<string> = inps.Repository.split('/');
    const repository: Repository = {
      owner: repoName[0],
      name: repoName[1]
    };
    const githubAPI = new GitHubAPI(inps.GithubToken, repository.owner, repository.name);
    const issues: Issues = {
      data: await githubAPI.getIssues(),
      fileName: 'issues.json',
      location: tmpDir,
      fullPath: ''
    };
    issues.fullPath = path.join(issues.location, issues.fileName);
    fs.writeFileSync(issues.fullPath, JSON.stringify(issues.data));
    const comments: Comments = {
      data: await githubAPI.getComments(),
      fileName: 'comments.json',
      location: tmpDir,
      fullPath: ''
    };
    comments.fullPath = path.join(comments.location, comments.fileName);
    fs.writeFileSync(comments.fullPath, JSON.stringify(comments.data));
    core.endGroup();

    core.startGroup('Upload training data as artifact');
    const artifactClient = artifact.create();
    const artifactOptions: artifact.UploadOptions = {
      continueOnError: true
    };
    const uploadResult = await artifactClient.uploadArtifact(
      'training_data',
      [issues.fullPath, comments.fullPath],
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
