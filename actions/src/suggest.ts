import {GitHubAPI} from './github-api';
import {Inputs} from './interfaces';
import {context} from '@actions/github/lib/utils';
import {md2text, removeSymbols} from './preprocess';
import fs from 'fs';
import path from 'path';

export async function suggest(inps: Inputs, tmpDir: string): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body = `${(context.payload.issue as any).body}`;
  const suggestBody = (() => {
    if (body === '') {
      return 'context body is empty';
    } else {
      return removeSymbols(md2text(body));
    }
  })();
  console.log(suggestBody);

  const results = JSON.parse(fs.readFileSync(path.join(tmpDir, 'suggestions.json'), 'utf8'));
  const topNcount = 3;
  let commentBody = '';
  for (let i = 0; i < topNcount; i++) {
    commentBody += `- [${results[i].title}](${results[i].html_url}) (${results[
      i
    ].probability.toFixed(3)})\n`;
  }

  const githubAPI = new GitHubAPI(inps.GithubToken, context.repo.owner, context.repo.repo);
  await githubAPI.createComment(commentBody);
}
