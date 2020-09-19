import {GitHubAPI} from './github-api';
import {Inputs} from './interfaces';
import {context} from '@actions/github/lib/utils';
import fs from 'fs';
import path from 'path';

export async function suggest(inps: Inputs, tmpDir: string): Promise<void> {
  const results = JSON.parse(fs.readFileSync(path.join(tmpDir, 'suggestions.json'), 'utf8'));
  const topNcount = Number(inps.MaxLinks);
  let commentBody = '';
  commentBody += 'Related links:\n';
  if (inps.Unclickable) {
    commentBody += '```\n';
  }
  for (let i = 0; i < topNcount; i++) {
    commentBody +=
      `- \`${results[i].probability.toFixed(3)}\` ` +
      `[${results[i].title}](${results[i].html_url})\n`;
  }
  if (inps.Unclickable) {
    commentBody += '```\n';
  }
  const logURL = `${process.env['GITHUB_SERVER_URL']}/${process.env['GITHUB_REPOSITORY']}/actions/runs/${process.env['GITHUB_RUN_ID']}`;
  commentBody +=
    `\n<div align="right">` +
    `<a href="${logURL}">Log</a>` +
    ` | ` +
    `<a href="https://github.com/peaceiris/actions-suggest-related-links">Bot Usage</a>` +
    `</div>\n`;

  const githubAPI = new GitHubAPI(inps.GithubToken, context.repo.owner, context.repo.repo);
  await githubAPI.createComment(commentBody);
}
