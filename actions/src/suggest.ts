import {GitHubAPI} from './github-api';
import {Inputs} from './interfaces';
import {context} from '@actions/github/lib/utils';

export async function suggest(inps: Inputs, body: string): Promise<void> {
  const githubAPI = new GitHubAPI(inps.GithubToken, context.repo.owner, context.repo.repo);
  githubAPI.createComment(body);
}
