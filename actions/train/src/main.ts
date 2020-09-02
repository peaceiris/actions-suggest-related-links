import {context} from '@actions/github';
import * as core from '@actions/core';
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

interface IssueData {
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

    core.startGroup('Fetch and save issues');
    const repoName: Array<string> = inps.Repository.split('/');
    const repository: Repository = {
      owner: repoName[0],
      name: repoName[1]
    };
    const githubAPI = new GitHubAPI(inps.GithubToken, repository.owner, repository.name);
    const issueData: IssueData = {
      data: await githubAPI.getIssues(),
      fileName: 'issues.json',
      location: '/tmp',
      fullPath: ''
    };
    issueData.fullPath = path.join(issueData.location, issueData.fileName);
    fs.writeFileSync(issueData.fullPath, JSON.stringify(issueData.data));
    core.endGroup();

    core.startGroup('Upload training data as artifact');
    const artifactClient = artifact.create();
    const artifactOptions: artifact.UploadOptions = {
      continueOnError: true
    };
    const uploadResult = await artifactClient.uploadArtifact(
      issueData.fileName,
      [issueData.fullPath],
      issueData.location,
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
