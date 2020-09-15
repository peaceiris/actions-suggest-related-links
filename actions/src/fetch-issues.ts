import fs from 'fs';
import path from 'path';
import {GitHubAPI} from './github-api';
import {Inputs, Repository, Issues, Comments} from './interfaces';

export async function fetchIssues(inps: Inputs, tmpDir: string): Promise<Repository> {
  const repoName: Array<string> = inps.Repository.split('/');
  const repository: Repository = {
    owner: repoName[0],
    name: repoName[1],
    issues: <Issues>{},
    comments: <Comments>{}
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

  repository.issues = issues;
  repository.comments = comments;

  return repository;
}
