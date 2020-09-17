import {GitHubAPI} from './github-api';
import {Inputs} from './interfaces';
import {context} from '@actions/github/lib/utils';
import {md2text, removeSymbols} from './preprocess';

export async function suggest(inps: Inputs): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = `${(context.payload.issue as any).body}`;
  const githubAPI = new GitHubAPI(inps.GithubToken, context.repo.owner, context.repo.repo);
  await githubAPI.createComment(removeSymbols(md2text(body)));
}
